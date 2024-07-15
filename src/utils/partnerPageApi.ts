const url = 'https://4bmze6xynsnug3aiuhbj5266t40jdwrs.lambda-url.eu-west-2.on.aws/'

export type PartnerPageApiData = {
  email: string
  firstname: string
  lastname: string
  website: string
  moreinfo: string
}

const partnerPageApi = async (formData: PartnerPageApiData) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...formData,
      iid: 45,
    }),
  })
  const data = await res.json()
  return data
}

export default partnerPageApi
