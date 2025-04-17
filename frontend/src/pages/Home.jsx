import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";

export default function Home(){
    const [categories, setCategories] = useState([])

    useEffect(()=>{
        getCategories()
          .then(res => setCategories(res.data))
          .catch(err => console.log(err));
    }, [])

    return (
        <div>
            <h1>Categorias</h1>
            <ul>
                {categories.map(c => (
                    <li key={c.id}>{c.name}</li>
                ))}
            </ul>
        </div>
    )
}