import {loginApi} from "../services";

export const LoginPage =()=>{
    const handleSubmit=(event:any)=>{
        event.preventDefault();
        const formData=new FormData(event.target);
        const email=formData.get('email');
        const password=formData.get('password');
        const response=loginApi(email as string,password as string )
        console.log(response)
    }
    return(
        <div>
            <form
            onSubmit={handleSubmit}>
                <h1>Login Page</h1>
                <label>
                    Email:
                    <input type="text"
                           name="email"
                           required
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password"
                           name="password"
                           required
                    />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}