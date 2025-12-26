import {newAccessToken, tokenIsExpired} from "./index";
import {routes} from "../constants/routes.ts";

export async function updateToken(token: string, login: (arg: any) => void, logout: () => void, navigate: any,funcArr: (() => void)[]): Promise<string | null> {
    const expired = token ? tokenIsExpired(token) : true;
    if(expired){
        const newAccessTokenResponse=await newAccessToken()
        if(newAccessTokenResponse?.status!==201){
            alert('Please login again')
            logout()
            for(let i = 0; i < funcArr.length; i++){
                funcArr[i]();
            }
            navigate(routes.LOGIN)
        }
        else{
            login(newAccessTokenResponse.data)
            token=newAccessTokenResponse.data
        }
    }
    return token;
}

