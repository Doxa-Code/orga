"use client";

import { QueryKeyFactory } from "@/app/actions/query-key-factory";
import { FormRegisterPartner } from "@/components/forms/partners/form-register-partner";
import { ModalDefault } from "@/components/modais/common/modal-default";
import { REGISTER_PARTNER_MODAL_NAME } from "@/constants";
import type { FormHandlesRef } from "@/hooks/use-form-ref";
import { useModais } from "@/hooks/use-modais";
import { usePartner } from "@/hooks/use-partner";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";

export function ModalRegisterPartner() {
	const { partnerId } = usePartner();
	const { closeModal } = useModais();
	const formRef = React.useRef<FormHandlesRef>(null);
	const router = useRouter();
	const queryClient = useQueryClient();

	return (
		<ModalDefault
			modalName={REGISTER_PARTNER_MODAL_NAME}
			title={partnerId ? "Editar cadastro" : "Novo cadastro"}
		>
			<FormRegisterPartner
				ref={formRef}
				onFinish={() => {
					queryClient.invalidateQueries({
						exact: true,
						queryKey: QueryKeyFactory.listPartnersLikeOption(),
					});
					closeModal(REGISTER_PARTNER_MODAL_NAME);
					router.refresh();
				}}
			/>
		</ModalDefault>
	);
}
