import axios from "axios";
import {jwtDecode} from "jwt-decode";

const route="http://localhost:3000";

export function tokenIsExpired(token?: string): boolean {
    const payload =jwtDecode(token!) as any;
  if (!payload || !payload.exp) return true;
  // exp is in seconds
  return Date.now() / 1000 >= payload.exp;
}

export async function tokenIsAdmin(token?: string): Promise<boolean> {
    const payload =jwtDecode(token!) as any;
    if (!payload || !payload.sub) return false;
    try{
        const response=await axios.get(`${route}/user/isAdmin/${payload?.sub}`,
            {
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            });
        return response.data.isAdmin;
    }
    catch (err){
        return false;
    }
}
