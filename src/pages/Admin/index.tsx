import { useEffect } from "react";
import agent from "../../utils/agent";

const Admin : React.FC = () => {


    useEffect(() => {
        try {
            const result = agent.Categories.list();
            console.log(result);
        } catch(error) {
            console.log(error);
        }
    }, [])

    return (
        <>
            <h1>this is admin page</h1>
        </>
    )
}


export default Admin;