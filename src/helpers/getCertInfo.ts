import fetch from 'node-fetch'

export type Certificate = {
	enFio: string
	birthdate: string
	doc: string
	enStuff: string
	en: boolean
	singlePhase: string
	fio: string
	enDoc: string
	vcSeries: string
	stuff: string
}

export const getCertInfo = async (
	idCertificate: string,
): Promise<Certificate | undefined> => {
	const response = await fetch(
		`https://www.gosuslugi.ru/api/vaccine/v1/cert/verify/${idCertificate}`,
	)

	if (!response.ok || response.status === 204) {
		return
	}

	return response.json() as Promise<Certificate>
}
