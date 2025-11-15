
import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

type AuthRegisterBody = {
        email: string
        firstName: string
        lastName: string
        password: string
      }

type AuthSignIn = {
   email: string
   password: string
}

export function useSignUp () {
 return useMutation({
    mutationFn: async (body : AuthRegisterBody) =>{
        const response = await apiClient.POST('/auth/register',{body})
        return response
    }
 })
}

export function useSignIn () {
 return useMutation({
    mutationFn: async (body : AuthSignIn) =>{
        const response = await apiClient.POST('/auth/login',{body})
        return response
    }
 })
}

