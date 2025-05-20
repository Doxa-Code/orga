class ProcessOfx {
  private transaction: any = {};
  private inTransaction = false;
  private total = 0;
  private result: { transactionFromOFX: any; transactionToReconcile: any }[] =
    [];

  private constructor(private token = "") {}

  private onParseOFXDate(dateString: string) {
    const [datePart, timeZonePart] = dateString.split("[");
    const year = Number(datePart?.substring(0, 4));
    const month = Number(datePart?.substring(4, 6)) - 1;
    const day = Number(datePart?.substring(6, 8));
    const hour = Number(datePart?.substring(8, 10));
    const minute = Number(datePart?.substring(10, 12));
    const second = Number(datePart?.substring(12, 14));

    const timeZoneOffset = timeZonePart
      ? Number(timeZonePart.match(/(-?\d+)/)![0])
      : 0;

    const utcDate = new Date(Date.UTC(year, month, day, hour, minute, second));

    const localDate = new Date(
      utcDate.getTime() - timeZoneOffset * 60 * 60 * 1000,
    );

    return localDate;
  }

  private *onExtractTransaction(lines: string[]) {
    for (const line of lines) {
      if (!line) {
        continue;
      }

      if (line.includes("<STMTTRN>")) {
        this.inTransaction = true;
        this.transaction = {};
      }

      if (!this.inTransaction) {
        continue;
      }

      if (line.includes("</STMTTRN>")) {
        this.inTransaction = false;
        yield this.transaction;
      }

      const tags = [
        { name: "FITID", prop: "id", regex: /<FITID>(.*?)<\/FITID>/ },
        { name: "MEMO", prop: "description", regex: /<MEMO>(.*?)<\/MEMO>/ },
        { name: "TRNTYPE", prop: "type", regex: /<TRNTYPE>(.*?)<\/TRNTYPE>/ },
        {
          name: "DTPOSTED",
          prop: "date",
          regex: /<DTPOSTED>(.*?)<\/DTPOSTED>/,
          processValue: this.onParseOFXDate,
        },
        {
          name: "TRNAMT",
          prop: "amount",
          regex: /<TRNAMT>(.*?)<\/TRNAMT>/,
          processValue: Number,
        },
      ];

      for (const tag of tags) {
        if (line.includes(`<${tag.name}>`)) {
          const value = line.match(tag.regex)?.[1];
          this.transaction[tag.prop] = tag.processValue?.(value!) || value;
        }
      }
    }

    return null;
  }

  private onUpdateView() {
    const percentage = (this.result.length * 100) / this.total;
    postMessage({
      event: "update",
      data: { total: this.total, processed: this.result.length, percentage },
    });
  }

  private onDelivery() {
    postMessage({ event: "finished", data: this.result });
    this.result = [];
    this.total = 0;
    this.token = "";
  }

  private async onFetchTransactionToReconcile() {
    const from = new Date(this.transaction.date);
    const to = new Date(this.transaction.date);

    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 59);

    const query = {
      id: this.transaction.id,
      amount: this.transaction.amount,
      from: from.toISOString(),
      to: to.toISOString(),
      type: this.transaction.type,
      status: "no paid",
    };

    const params = new URLSearchParams(query);

    const response = await fetch(`/api/v1/transactions?${params.toString()}`, {
      headers: {
        authorization: `Bearer ${this.token}`,
      },
    });
    const result = await response.json();
    return result?.[0] || null;
  }

  private async onProcessLines(lines: string[]) {
    this.total = lines.filter((line) => line.includes("<STMTTRN>")).length;
    this.onUpdateView();

    for await (const transaction of this.onExtractTransaction(lines)) {
      const transactionToReconcile = await this.onFetchTransactionToReconcile();

      this.result.push({
        transactionFromOFX: {
          ...transaction,
          amount:
            transaction.type === "DEBIT"
              ? transaction.amount * -1
              : transaction.amount,
        },
        transactionToReconcile: transactionToReconcile
          ? {
              ...transactionToReconcile,
              transactionFromOFXId: transaction.id,
            }
          : null,
      });

      this.onUpdateView();
    }
  }

  private onFindOcurrencies() {
    const onProcessLines = this.onProcessLines.bind(this);
    const onDelivery = this.onDelivery.bind(this);

    return new WritableStream({
      async write(jsonLine: string) {
        const lines = jsonLine.split("\n");
        await onProcessLines(lines);
      },
      close: () => onDelivery(),
    });
  }

  static run(file: File, token: string) {
    const processOFX = new ProcessOfx(token);
    file
      .stream()
      .pipeThrough(new TextDecoderStream())
      .pipeTo(processOFX.onFindOcurrencies());
  }
}

self.addEventListener("message", async ({ data: { file, token } }) => {
  ProcessOfx.run(file, token);
});
