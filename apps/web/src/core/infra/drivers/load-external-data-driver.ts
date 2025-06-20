import type { Address } from "@/core/domain/valueobjects/address";
import type { City } from "@/core/domain/valueobjects/city";
import type { State } from "@/core/domain/valueobjects/state";
import axios from "axios";
import type { PartnerFinded } from "../../application/DAO/retrieve-partner-by-tax-id";

interface LoadExternalDataDriver {
  listState(): Promise<State[]>;
  retrieveCities(acronymState: string): Promise<City[]>;
  retrieveAddressByZipCode(zipcode: string): Promise<Address | null>;
  retrievePartnerByTaxId(taxid: string): Promise<PartnerFinded | null>;
}

type ResponseStateDTO = {
  sigla: string;
  nome: string;
};

type ResponseCityDTO = {
  nome: string;
};

type ResponseAddressByZipCodeDTO = {
  type?: string;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
};

type ResponsePartnerByTaxIdDTO = {
  type?: string;
  email?: string;
  bairro?: string;
  numero?: string;
  municipio?: string;
  logradouro?: string;
  complemento?: string;
  nome_fantasia?: string;
  uf?: string;
  cep?: string;
  ddd_telefone_1?: string;
  razao_social?: string;
};

export class BrasilApiLoadExternalDataDriver implements LoadExternalDataDriver {
  private readonly request = axios.create({
    baseURL: "https://brasilapi.com.br/api",
  });

  async retrievePartnerByTaxId(taxId: string): Promise<PartnerFinded | null> {
    try {
      const response = await axios.get<ResponsePartnerByTaxIdDTO>(
        `https://minhareceita.org/${taxId}`,
      );
      const partner = response?.data;

      if (partner?.type) {
        return null;
      }

      return {
        address: {
          city: partner.municipio,
          country: "Brasil",
          neighborhood: partner.bairro,
          note: partner.complemento,
          number: partner.numero,
          state: partner.uf,
          street: partner.logradouro,
          zipCode: partner.cep,
        },
        createdAt: new Date(),
        email: partner.email,
        name: partner.nome_fantasia || partner.razao_social,
        phone: partner.ddd_telefone_1,
        taxId,
      } as PartnerFinded;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async listState(): Promise<State[]> {
    try {
      const response =
        await this.request.get<ResponseStateDTO[]>("/ibge/uf/v1");
      return response.data.map<State>((state) => ({
        acronym: state.sigla,
        name: state.nome,
      }));
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async retrieveCities(acronymState: string): Promise<City[]> {
    try {
      const response = await this.request.get<ResponseCityDTO[]>(
        `/ibge/municipios/v1/${acronymState}?providers=dados-abertos-br,gov,wikipedia`,
      );
      return response.data.map<City>((state) => ({
        name: state.nome,
      }));
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  async retrieveAddressByZipCode(zipcode: string): Promise<Address | null> {
    try {
      const response = await this.request.get<ResponseAddressByZipCodeDTO>(
        `/cep/v2/${zipcode}`,
      );
      const address = response.data;

      if (address.type) {
        return null;
      }

      return {
        city: address.city || "",
        country: "Brasil",
        neighborhood: address.neighborhood || "",
        state: address.state || "",
        street: address.street || "",
        zipCode: zipcode,
      } as Address;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
