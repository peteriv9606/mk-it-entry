import Cookies from 'js-cookie'
import jwtDecode from "jwt-decode";
import merge from "lodash/merge"

export const getUser = async () => {
  let username = ''
  try {
    if (Cookies.get("access") !== undefined) {
      username = jwtDecode(Cookies.get('access')).username
    } else {
      let new_token = await refreshToken()
      if (new_token?.access !== undefined) {
        Cookies.set('access', new_token.access)
        username = jwtDecode(Cookies.get('access')).username
      } else {
        return undefined
      }
    }
    return await fetchWithToken(process.env.apiUrl + "users/" + username + "/").then(res => res.json())
  } catch (error) {
    // console.log(error) // pretty much it would say {message: 'Invalid token specified'}
    return undefined
  }
} 

export const fetchWithTokenSSR = async (context, url, requestOptions) => {
  const c = context.req.headers.cookie.split('; ')
  let cookies = {}
  for (const element of c) {
    let cookie = Object(element.split('='))
    cookies[cookie[0]] = cookie[1]
  }
  requestOptions = merge(requestOptions, {
    headers: { "Authorization": `Bearer ${cookies['access']}` }
  })

  const res = await fetch(url, requestOptions)

  if (res?.status === 401) {
    const new_token = await fetch(process.env.apiUrl + "auth/token/refresh/", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "refresh": cookies['refresh'] })
    }).then(res => res.json())
    if (new_token?.access !== undefined) {
      // another attempt to fetch with new token
      requestOptions = merge(requestOptions, {
        headers: { "Authorization": `Bearer ${new_token.access}` }
      })
      return await fetch(url, requestOptions)
    }
  }
  return res
}

export const fetchWithToken = async (url, requestOptions) => {
  if (Cookies.get("access") !== undefined) {
    requestOptions = merge(requestOptions, {
      headers: { "Authorization": `Bearer ${Cookies.get("access")}` }
    })
  }
  requestOptions= merge(requestOptions, {
    headers: { "Content-type": 'application/json' }
  })

  const result = await fetch(url, requestOptions)
  if (result?.status === 401 || result?.status === 403) {
    const refresh_response = await refreshToken()
    if (refresh_response?.access !== undefined) {
      Cookies.set("access", refresh_response.access)

      requestOptions = merge(requestOptions, {
        headers: { "Authorization": `Bearer ${Cookies.get("access")}` }
      })

      return await fetch(url, requestOptions)

    } else {
      Cookies.remove('access')
      Cookies.remove('refresh')
      // router.replace("/login")
    }
  }
  return result
}

const refreshToken = async () => {
  return await fetch(process.env.apiUrl + "auth/token/refresh/", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "refresh": Cookies.get('refresh') })
  })
    .then(res => res.json())
}

