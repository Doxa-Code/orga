import { FieldInvalid } from "../errors/field-invalid";

export class TaxId {
  constructor(readonly value: string) {
    if (!this.isValidTaxId(value)) {
      throw new FieldInvalid("Tax ID");
    }
  }

  private isValidTaxId(value: string): boolean {
    return this.isValidCPF(value) || this.isValidCNPJ(value);
  }

  private isValidCPF(value: string): boolean {
    let cpf = value;
    if (!cpf) {
      return true;
    }
    cpf = cpf.replace(/[^\d]/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += Number.parseInt(cpf.charAt(i)) * (10 - i);
    }

    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== Number.parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += Number.parseInt(cpf.charAt(i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== Number.parseInt(cpf.charAt(10))) return false;

    return true;
  }

  private isValidCNPJ(value: string): boolean {
    let cnpj = value;
    if (!cnpj) {
      return true;
    }
    cnpj = cnpj.replace(/[^\d]/g, "");
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

    return true;
  }

  static create(value?: string | null) {
    return new TaxId(value || "");
  }
}
