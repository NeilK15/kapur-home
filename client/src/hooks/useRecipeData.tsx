import { useEffect, useState } from "react";
import { RecipeData } from "../@customTypes/RecipeTypes";

export const useRecipeData = (id: number) => {
  const [data, setData] = useState<RecipeData>();

  useEffect(() => {
    fetch(`http://localhost:8000/recipes?${id}`)
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((json) => {
        console.log(json);
        setData(json);
      })
      .catch((err) => {
        console.log("The recipe doesn't exist", err);
      });
  }, []);

  return {
    data,
  };
};
