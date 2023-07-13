import Recipe from "./components/Recipe";
import "./css/testing.css";
import data from "../../../sample-data/sample_recipe_data.json";
import { RecipeData } from "./@customTypes/RecipeTypes";

function getRecipeData(id: number): RecipeData {
  // console.log(id);
  // const res = await fetch(`http://localhost:8000/recipes${id}`, { cache: "no-cache" });
  // if (!res.ok) {
  //   throw new Error("Failed to fetch recipe data");
  // }
  // return res.json();

  // const res = {
  //   id: 118143645813702128093224199389028019238,
  //   prepTime: 1,
  //   prepTimeUnit: "mins",
  //   cookTime: 2,
  //   cookTimeUnit: "mins",
  //   totalTime: 3,
  //   totalTimeUnit: "mins",
  //   course: "dinner, Main, Main Course, Soup",
  //   cuisine: "Asian fusion",
  //   name: "Spicy Peanut Butter Ramen",
  //   keywords: ["peanut gochujang ramen", "spicy peanut butter ramen"],
  //   servings: 4,
  //   author: "Vegan Richa",
  //   url: "https://www.veganricha.com/spicy-peanut-butter-ramen/",
  //   imageUrl: "",
  //   description:
  //     "Spicy peanut butter ramen is an absolute comfort food recipe with a delicious, creamy broth, gochujang flavors, lots of ginger and garlic, topped with Gochujang tofu. It's a 30-minute, One-pan meal. The noodles are cooked directly in the broth, so you only need one pot. ",
  //   ingredientGroups: [
  //     {
  //       title: "For the crispy gochujang garlic tofu:",
  //       ingredients: [
  //         {
  //           name: "firm or extra firm tofu",
  //           amount: { amt: "10", unit: "oz", scale: "imperial" },
  //           notes: "pressed for at least 15 minutes and sliced into rectangles or cubes or whatever shape you like",
  //         },
  //         {
  //           name: "soy sauce",
  //           amount: { amt: "2", unit: "teaspoons", scale: "imperial" },
  //           notes: "or tamari ",
  //         },
  //         {
  //           name: "gochujang",
  //           amount: { amt: "2", unit: "teaspoons", scale: "imperial" },
  //           notes: "",
  //         },
  //         {
  //           name: "garlic powder",
  //           amount: { amt: "1/2", unit: "teaspoon", scale: "imperial" },
  //           notes: "",
  //         },
  //         {
  //           name: "sesame oil",
  //           amount: { amt: "1", unit: "teaspoon", scale: "imperial" },
  //           notes: "",
  //         },
  //         {
  //           name: "cornstarch or tapioca starch",
  //           amount: { amt: "1", unit: "tablespoon", scale: "imperial" },
  //           notes: "",
  //         },
  //       ],
  //     },
  //     {
  //       title: "For the peanut butter ramen:",
  //       ingredients: [
  //         {
  //           name: "oil",
  //           amount: { amt: "1", unit: "teaspoon", scale: "imperial" },
  //           notes: "optional",
  //         },
  //         {
  //           name: "sliced mushrooms",
  //           amount: { amt: "6", unit: "oz", scale: "imperial" },
  //           notes: "such as white or cremini or portabella ",
  //         },
  //         {
  //           name: "ginger-garlic paste",
  //           amount: { amt: "2", unit: "tablespoon", scale: "imperial" },
  //           notes:
  //             "or you can mince or blend 1 inch of ginger and 3 cloves of garlic with a few teaspoons water, to make a paste and use",
  //         },
  //         {
  //           name: "smooth peanut butter",
  //           amount: { amt: "3", unit: "tablespoons", scale: "imperial" },
  //           notes: "",
  //         },
  //         {
  //           name: "gochujang",
  //           amount: { amt: "1", unit: "tablespoon", scale: "imperial" },
  //           notes: "or other Asian chile sauce ",
  //         },
  //         {
  //           name: "maple syrup",
  //           amount: { amt: "1", unit: "tablespoon", scale: "imperial" },
  //           notes: "",
  //         },
  //         {
  //           name: "soy sauce",
  //           amount: { amt: "2", unit: "tablespoons", scale: "imperial" },
  //           notes: "or tamari ",
  //         },
  //         {
  //           name: " water or stock ",
  //           amount: { amt: "4-6", unit: "cups", scale: "imperial" },
  //           notes: "**",
  //         },
  //         {
  //           name: "ramen or thin udon noodles ",
  //           amount: { amt: "6", unit: "oz", scale: "imperial" },
  //           notes: "",
  //         },
  //       ],
  //     },
  //     {
  //       title: "For garnish:",
  //       ingredients: [
  //         {
  //           name: "lime wedges, green onions, sesame seeds ",
  //           amount: { amt: "", unit: "", scale: "imperial" },
  //           notes: "",
  //         },
  //       ],
  //     },
  //   ],
  //   instructionGroup: [
  //     {
  //       title: "Make the gochujang garlic tofu.",
  //       instructions: [
  //         {
  //           instruction: "Press and cube the tofu if you haven't already and add it to a bowl.",
  //           imageUrl: "",
  //         },
  //         {
  //           instruction:
  //             "In a small bowl mix the soy sauce, gochujang, garlic powder, and sesame oil and pour it over the tofu. Toss well to coat. Add 2 teaspoons of the cornstarch and toss well. If the mixture is still somewhat wet then add the rest of the cornstarch and toss well.",
  //           imageUrl: "",
  //         },
  //         {
  //           instruction:
  //             "Then either bake the tofu: transfer the tofu cubes to a parchment-lined baking sheet and bake it at 400ºF (205c) for 20-25 minutes , or transfer them to a hot wok with a teaspoon of oil and cook them until they are crisp on most of the edges, about 5-6 minutes.",
  //           imageUrl: "",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Make the ramen:",
  //       instructions: [
  //         {
  //           instruction:
  //             "I use the same wok for making the tofu as well as the ramen. Remove the tofu once crisp from the pot and then make the ramen. Add oil, mushrooms, and a good pinch of salt and cook for 2-3 minutes to brown the mushrooms on some of the edges. Then add the ginger-garlic paste, peanut butter, gochujang, and soy sauce and mix really well. Add 1/4 cup of the water or broth and mix in. Mix well to incorporate the peanut butter.",
  //           imageUrl: "",
  //         },
  //         {
  //           instruction:
  //             "Bring the mixture to a boil then gradually add the rest of the broth. Mix and Bring to a good rolling boil, then add your noodles. Press to submerge in the boiling broth, then cook them according to the time on the packaging. Ramen noodles will cook pretty quickly, within 3-4 minutes, while udon noodles will take around 7-8 minutes.",
  //           imageUrl: "",
  //         },
  //         {
  //           instruction:
  //             "Once the noodles are cooked to your preference, switch off the heat. Taste and adjust salt and flavor. If you want it sweeter then you can add more maple syrup. You can more salt if needed or some black pepper for extra heat.",
  //           imageUrl: "",
  //         },
  //         {
  //           instruction:
  //             "To serve, ladle the broth into your serving bowls. Then transfer some of the noodles with mushrooms to your serving bowls. Top it with the crispy tofu, a squeeze of lime or lemon, lime wedge, green onions, and sesame seeds, and serve.",
  //           imageUrl: "",
  //         },
  //         {
  //           instruction:
  //             "To make ahead: cook the noodles separately and store. Crisp up the tofu and store. Add only 3 cups broth and boil and refrigerate after cooling. To serve, bring the broth to a boil, add noodles and serve. Refrigerate for up 3 days.",
  //           imageUrl: "",
  //         },
  //       ],
  //     },
  //   ],
  //   notes: [
  //     {
  //       title: "Nutfree",
  //       note: "use sunflower butter or almond butter instead of peanut butter for Peanut-free",
  //     },
  //     {
  //       title: "Glutenfree",
  //       note: "Use Glutenfree noodles, use tamari instead of soy sauce. ensure that Gochujang is gluten-free",
  //     },
  //     {
  //       title: "Soy-free",
  //       note: "Use chickpea tofu instead of tofu, coconut aminos for the soy sauce.  Gochujang often has soy, so use 2 teaspoons each of gochugaru pepper flakes, chickpea miso, coconut aminos and. 1 teaspoon maple syrup to make your own Gochujang.",
  //     },
  //     {
  //       title: "",
  //       note: "Use 3.5-4 cups for noodle stir fry kind of result , 6-7 cups for more brothy noodles . Liquid content also depends on the type of noodles and the brand. Ramen that cook faster will absorb less. Udon will absorb more. I mostly use udon and the recipe reflects corresponding liquid amount. ",
  //     },
  //   ],
  //   nutrition: [
  //     {
  //       title: "Calories",
  //       value: 342,
  //       unit: "",
  //     },
  //     {
  //       title: "Fat",
  //       value: 11,
  //       unit: "g",
  //     },
  //     {
  //       title: "Carbohydrates",
  //       value: 45,
  //       unit: "g",
  //     },
  //     {
  //       title: "Sodium",
  //       value: 635,
  //       unit: "mg",
  //     },
  //     {
  //       title: "Potassium",
  //       value: 306,
  //       unit: "mg",
  //     },
  //     {
  //       title: "Fiber",
  //       value: 4,
  //       unit: "6",
  //     },
  //     {
  //       title: "Sugar",
  //       value: 10,
  //       unit: "g",
  //     },
  //     {
  //       title: "Vitamin A",
  //       value: 13,
  //       unit: "IU",
  //     },
  //     {
  //       title: "Vitamin C",
  //       value: 2,
  //       unit: "mg",
  //     },
  //     {
  //       title: "Calcium",
  //       value: 114,
  //       unit: "mg",
  //     },
  //     {
  //       title: "Iron",
  //       value: 2,
  //       unit: "mg",
  //     },
  //   ],
  //   metadata: {
  //     dateCreated: null,
  //     dateTimeExtracted: "2023-07-10T22:26:31.194045",
  //     extractionMethod: "web-scrapping",
  //   },
  // };

  const res = data;

  return res as RecipeData;
}

async function Page({ params }: { params: { id: number } }) {
  const recipeData = getRecipeData(params.id);

  // const [recipe] = await Promise.all([recipeData]);

  console.log(params.id);

  return <Recipe recipeData={recipeData} />;
}

export default Page;
