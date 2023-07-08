import { useEffect, useState } from "react";
import { RecipeData } from "../@customTypes/RecipeTypes";

type Params = {
  id?: number;
  url?: string;
};

export const useRecipeData = ({ id, url = `http://localhost:8000/recipes?${id}` }: Params) => {
  const [data, setData] = useState<RecipeData>();

  useEffect(() => {
    fetch(url)
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
