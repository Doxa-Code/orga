import { Heading, Paragraph } from "@/components/common/typograph";
import { InputDatePicker } from "@/components/inputs/common/input-date-picker";
import { InputQuantity } from "@/components/inputs/common/input-quantity";
import { SelectPaymentMethod } from "@/components/selects/common/select-payment-method";
import { SelectWallets } from "@/components/selects/wallets/select-wallets";
import type { InputFormDefaultProps } from "@/components/type";
import { EditPaymentsValuesPresentation } from "@orga/core/presenters";
import { Input } from "@orgaput";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@orgarm";

export const PaymentSessionInputForm: React.FC<InputFormDefaultProps> = ({
  form,
  ...props
}) => {
  return (
    <section
      data-hidden={props.hidden}
      className="max-h-[400px] w-full overflow-y-auto data-[hidden=true]:hidden"
    >
      <header className="sticky top-0 z-50 border-b bg-white py-2">
        <Heading className="text-slate-600" level={2}>
          Parcelas
        </Heading>
      </header>
      <table>
        <tbody>
          <FormField
            control={form?.control}
            name={props.name}
            render={({ field }) => (
              <>
                {field.value.map((payment: any, index: number) => (
                  <tr key={index}>
                    <td className="pr-3 text-center">
                      <Paragraph className="text-sm font-medium text-slate-700">
                        {index + 1}
                      </Paragraph>
                    </td>
                    <td className="py-6 pr-4">
                      <FormItem>
                        <FormLabel>Vencimento</FormLabel>
                        <FormControl>
                          <InputDatePicker
                            date={payment.dueDate}
                            onSelectDate={(date) => {
                              const payments = field.value;
                              payments[index]!.dueDate = date!;
                              field.onChange(payments);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </td>
                    <td className="pr-4">
                      <FormItem>
                        <FormLabel>Valor (R$)</FormLabel>
                        <FormControl>
                          <InputQuantity
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && props.preventDefault) {
                                e.preventDefault();
                              }
                            }}
                            value={payment.amount
                              .toLocaleString("pt-BR", {
                                currency: "BRL",
                                style: "currency",
                              })
                              .replace("R$", "")}
                            disabled={index === field.value.length - 1}
                            onChange={(value) => {
                              field.onChange(
                                EditPaymentsValuesPresentation.changeAmount({
                                  index,
                                  payments: field.value,
                                  total: form?.getValues().amount,
                                  value: Number(value),
                                }),
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </td>
                    <td className="pr-4">
                      <FormItem>
                        <FormLabel>Percentual (%)</FormLabel>
                        <FormControl>
                          <InputQuantity
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && props.preventDefault) {
                                e.preventDefault();
                              }
                            }}
                            fixed={1}
                            value={payment.percentage
                              .toFixed(1)
                              .replace(".", ",")}
                            disabled={index === field.value.length - 1}
                            onChange={(value) => {
                              field.onChange(
                                EditPaymentsValuesPresentation.changePercentage(
                                  {
                                    index,
                                    payments: field.value,
                                    total: form?.getValues().amount,
                                    value: Number(value),
                                  },
                                ),
                              );
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </td>
                    <td className="pr-4">
                      <FormItem>
                        <FormLabel>Forma de pagamento</FormLabel>
                        <FormControl>
                          <SelectPaymentMethod
                            value={field.value[index]!.paymentMethod}
                            onChange={(paymentMethod) => {
                              const payments = field.value;
                              payments[index]!.paymentMethod = paymentMethod!;
                              field.onChange(payments);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </td>
                    <td className="pr-4">
                      <FormItem>
                        <FormLabel>
                          {form?.getValues().type === "CREDIT"
                            ? "Conta de recebimento"
                            : "Conta de pagamento"}
                        </FormLabel>
                        <FormControl>
                          <SelectWallets
                            onChange={(paymentMethod) => {
                              const payments = field.value;
                              payments[index]!.walletId =
                                paymentMethod! as string;
                              field.onChange(payments);
                            }}
                            value={field.value[index]!.walletId}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </td>
                    <td className="w-full">
                      <FormItem className="w-full">
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full"
                            autoFocus
                            value={field.value[index]!.description}
                            onChange={(e) => {
                              const payments = field.value;
                              payments[index]!.description = e.target.value;
                              field.onChange(payments);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </td>
                  </tr>
                ))}
              </>
            )}
          />
        </tbody>
      </table>
    </section>
  );
};
