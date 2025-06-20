import {
  AccountPlan,
  type CreateAccountPlanDTO,
} from "../../domain/entities/account-plan";

interface AccountPlanRepository {
  save(accountsPlans: AccountPlan): Promise<void>;
  exists(name: string, workspaceId: string): Promise<boolean>;
}

export class PopulateAccountPlanService {
  constructor(private readonly accountPlanRepository: AccountPlanRepository) {}

  async execute(workspaceId: string): Promise<void> {
    const accountPlanList: CreateAccountPlanDTO[] = [
      {
        name: "Despesas Fixas",
        type: "FIXED_EXPENSE",
        workspaceId,
        operation: "EXPENSE",
        sequence: 1,
        categories: [
          { sequence: "1.1", name: "Aluguel" },
          { sequence: "1.2", name: "Energia Elétrica" },
          { sequence: "1.3", name: "Água e Esgoto" },
          { sequence: "1.4", name: "Internet e Telefone" },
          { sequence: "1.5", name: "Manutenção e Reparos" },
          { sequence: "1.6", name: "Seguros" },
          { sequence: "1.7", name: "Contabilidade e Assessoria Fiscal" },
          { sequence: "1.8", name: "Salários e Encargos Sociais" },
          { sequence: "1.9", name: "Impostos e Taxas" },
          { sequence: "1.10", name: "Material de Escritório" },
          { sequence: "1.11", name: "Assinaturas e Licenças" },
          { sequence: "1.12", name: "Marketing e Propaganda" },
          { sequence: "1.13", name: "Outras Despesas Fixas" },
          { sequence: "1.14", name: "Pró labore" },
        ],
      },
      {
        name: "Despesas Variaveis",
        type: "VARIABLE_EXPENSE",
        workspaceId,
        operation: "EXPENSE",
        sequence: 2,
        categories: [
          { sequence: "2.1", name: "Despesas Comerciais" },
          { sequence: "2.2", name: "Vendas" },
          { sequence: "2.3", name: "Marketing e Propaganda" },
          { sequence: "2.4", name: "Transporte" },
          { sequence: "2.5", name: "Outras Despesas Variáveis" },
          { sequence: "2.6", name: "Movimentações pessoais" },
          { sequence: "2.7", name: "Água e Esgoto" },
          { sequence: "2.8", name: "Energia Elétrica" },
          { sequence: "2.9", name: "Manutenção e Reparos" },
          { sequence: "2.10", name: "Material de Escritório" },
          { sequence: "2.11", name: "Mercado" },
        ],
      },
      {
        name: "Custos",
        type: "COST",
        workspaceId,
        operation: "EXPENSE",
        sequence: 3,
        categories: [
          {
            sequence: "3.1",
            name: "Custo dos Produtos Vendidos (CPV)",
          },
          {
            sequence: "3.2",
            name: "Custo dos Serviços Prestados (CSP)",
          },
          {
            sequence: "3.3",
            name: "Outros custos",
          },
        ],
      },
      {
        name: "Dividas",
        type: "DEBT",
        workspaceId,
        operation: "EXPENSE",
        sequence: 4,
        categories: [
          {
            sequence: "4.1",
            name: "Empréstimo bancário",
          },
          {
            sequence: "4.2",
            name: "Financiamento de veículo",
          },
          {
            sequence: "4.3",
            name: "Empréstimos de Terceiros",
          },
          {
            sequence: "4.4",
            name: "Faturas de Cartão de Crédito",
          },
          {
            sequence: "4.5",
            name: "Outras Dívidas e Obrigações",
          },
        ],
      },
      {
        name: "Receitas Operacionais",
        type: "OPERATIONAL_REVENUE",
        workspaceId,
        operation: "REVENUE",
        sequence: 5,
        categories: [
          { sequence: "5.1", name: "Vendas de Produtos" },
          { sequence: "5.2", name: "Prestação de Serviços" },
        ],
      },
      {
        name: "Receitas Não Operacionais",
        type: "NON_OPERATIONAL_REVENUE",
        workspaceId,
        operation: "REVENUE",
        sequence: 6,
        categories: [
          { sequence: "6.1", name: "Rendimentos de Investimentos" },
          { sequence: "6.2", name: "Aluguéis Recebidos" },
        ],
      },
      {
        name: "Outras Receitas",
        type: "OTHER_REVENUE",
        workspaceId,
        operation: "REVENUE",
        sequence: 7,
        categories: [
          { sequence: "7.1", name: "Receitas de Royalties" },
          { sequence: "7.2", name: "Receitas de Multas e Penalidades" },
          { sequence: "7.3", name: "Receitas de Vendas de Ativos" },
          { sequence: "7.4", name: "Subvenções e Incentivos" },
        ],
      },
      {
        name: "Receitas Financeiras",
        type: "FINANCIAL_REVENUE",
        workspaceId,
        operation: "REVENUE",
        sequence: 8,
        categories: [
          { sequence: "8.1", name: "Ganhos em Aplicações Financeiras" },
          { sequence: "8.2", name: "Variação Cambial Ativa" },
        ],
      },
      {
        name: "Receitas de Parcerias",
        type: "PARTNERSHIP_REVENUE",
        workspaceId,
        operation: "REVENUE",
        sequence: 9,
        categories: [
          { sequence: "9.1", name: "Receitas de Parcerias Estratégicas" },
          { sequence: "9.2", name: "Receitas de Joint Ventures" },
        ],
      },
      {
        name: "Receitas Diversas",
        type: "MISCELLANEOUS_REVENUE",
        workspaceId,
        operation: "REVENUE",
        sequence: 10,
        categories: [
          { sequence: "10.1", name: "Receitas Eventuais" },
          { sequence: "10.2", name: "Receitas de Doações" },
        ],
      },
    ];
    await Promise.all(
      accountPlanList.map(async (input) => {
        const accountPlan = AccountPlan.create(input);

        const exists = await this.accountPlanRepository.exists(
          accountPlan.name,
          accountPlan.workspaceId,
        );

        if (!exists) {
          await this.accountPlanRepository.save(accountPlan);
        }

        return accountPlan;
      }),
    );
  }
}
