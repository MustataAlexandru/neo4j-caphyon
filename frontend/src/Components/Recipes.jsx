/* eslint-disable tailwindcss/no-custom-classname */
import { Card, Modal, Button, Pagination } from "flowbite-react";
import React, { useState, useEffect } from "react";
import Search from "./Search";
import CheckboxFilters from "./CheckboxFilters";
import SideTable from "./SideTable";

///// HAD TROUBLE SETTING A RELATIONSHIP BETWEEN RECIPES , INGREDIENTS AND AUTHORS
///// FROM THE DATABSE , SO I RANDOMISED EVERYTHING
///// SOME RECIPES MAY HAVE 20 INGREDIENTS BUT WELL ...
///// PERHAPS THIS WAS THE CHALLENGE YOU
///// NEVER WORKED WITH neo4j BEFORE
///// =====> RECIPES INGREDIENTS AND AUTHORS RESET EVERY REFRESH OR EVREY CODE SAVE (CTRL + S)

export default function Recipes() {
  const [openModal, setOpenModal] = useState(false);
  const [authorsModal, setAuthorsModal] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const limit = 20;
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [complicatedRecipes, setComplicatedRecipes] = useState([]);
  const [prolificAuthors, setProlificAuthors] = useState([]);
  const [commonIngredints, setCommonIngredients] = useState([]);
  const [skillLevels, setSkillLevels] = useState([]);
  const [possibleSkillLevels, setPossibleSkillLevels] = useState([]);
  const [sortingOrder, setSortingOrder] = useState("");

  const fetchData = async () => {
    try {
      const authorsData = await fetch("http://localhost:3003/authors").then(
        (res) => res.json(),
      );
      const ingredientsData = await fetch(
        "http://localhost:3003/ingredients",
      ).then((res) => res.json());

      setAuthors(authorsData);
      setIngredients(ingredientsData);
    } catch (error) {
      console.error("ERROR fetching data:", error);
    }
  };

  const getRecipes = async (page = 1) => {
    try {
      const res = await fetch(
        `http://localhost:3003/recipes?page=${page}&limit=${limit}`,
      );
      if (!res.ok) throw new Error(`HTTP ERRROR status: ${res.status}`);
      const data = await res.json();
      const updatedRecipes = data.recipes
        .sort((first, second) => {
          if (first.name < second.name) return -1;
          else return 1;
        })
        .map((recipe) => {
          const randomAuthor =
            authors[Math.floor(Math.random() * authors.length)];
          //////////// I WILL BE MAKING THIS RANDOM IN ORDER TO BE ABLE TO
          //////////// DECIDE A RECIPE COMPLEXITY
          const randomIngredients = ingredients.slice(
            0,
            Math.floor(Math.random() * 20),
          );
          return {
            ...recipe,
            author: randomAuthor.name,
            ingredients: randomIngredients.map((ingredient) => ingredient.name),
          };
        });
      const decideWhichAre = (recipes) => {
        const getCounter = recipes.map((item) => ({
          ...item,
          ingredientCount: item.ingredients.length,
        }));

        const sortedRecipes = getCounter.sort(
          (first, second) => second.ingredientCount - first.ingredientCount,
        );
        const topComplicatedRecipes = sortedRecipes.slice(0, 5);
        return topComplicatedRecipes;
      };

      const getAllPossibleSkillLevels = (recipes) => {
        const possibleSkillLevels = recipes.reduce((acc, recipe) => {
          if (!acc.includes(recipe.skillLevel)) {
            acc.push(recipe.skillLevel);
          }
          return acc;
        }, []);
        return possibleSkillLevels;
      };

      const getProlificAuthors = (recipes) => {
        const authorDetails = recipes.reduce((acc, recipe) => {
          if (!acc[recipe.author]) {
            acc[recipe.author] = { count: 0, recipes: [] };
          }
          acc[recipe.author].count += 1;
          acc[recipe.author].recipes.push(recipe.name);
          return acc;
        }, {});
        const sortedAuthors = Object.entries(authorDetails)
          .sort((first, second) => second[1].count - first[1].count)
          .slice(0, 5)
          .map((item) => ({
            name: item[0],
            count: item[1].count,
            recipes: item[1].recipes,
          }));
        return sortedAuthors;
      };
      const getMostCommonIngrdients = (recipes) => {
        const ingredientCount = {};
        recipes.forEach((recipe) => {
          recipe.ingredients.forEach((ingredient) => {
            if (!ingredientCount[ingredient]) {
              ingredientCount[ingredient] = 0;
            }
            ingredientCount[ingredient] += 1;
          });
        });
        const sortedIngredients = Object.entries(ingredientCount)
          .sort((first, second) => second[1] - first[1])
          .slice(0, 5)
          .map((item) => ({
            ingredient: item[0],
            count: item[1],
          }));
        return sortedIngredients;
      };

      setRecipes(updatedRecipes);
      setPossibleSkillLevels(getAllPossibleSkillLevels(updatedRecipes));
      setCommonIngredients(getMostCommonIngrdients(updatedRecipes));
      setProlificAuthors(getProlificAuthors(updatedRecipes));
      setComplicatedRecipes(decideWhichAre(updatedRecipes));
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("ERROR fetching recipes:", error);
    }
  };

  const filterRecipes = () => {
    const filtered = recipes.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        checkedIngredients.every((ingredient) =>
          recipe.ingredients.includes(ingredient),
        ) &&
        skillLevels.every((skillLevel) =>
          recipe.skillLevel.includes(skillLevel),
        ),
    );
    if (sortingOrder === "asc") {
      filtered.sort(
        (first, second) => first.ingredients.length - second.ingredients.length,
      );
    } else if (sortingOrder === "desc") {
      filtered.sort(
        (first, second) => second.ingredients.length - first.ingredients.length,
      );
    }

    setFilteredRecipes(filtered);
  };

  const handleOpen = (recipeId) => {
    setSelectedRecipe(filteredRecipes[recipeId]);
    setOpenModal(true);
  };

  const onPageChange = (page) => setCurrentPage(page);

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    getRecipes(currentPage);
  }, [currentPage, authors, ingredients]);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm, checkedIngredients, skillLevels, sortingOrder]);

  let authorRecipes = [];
  recipes.forEach((recipe) => {
    authorRecipes.push({
      author: recipe.author,
      recipeName: recipe.name,
      ingredients: recipe.ingredients,
      cookingTime: recipe.cookingTime,
      description: recipe.description,
      preparationTime: recipe.preparationTime,
    });
  });

  const handleAuthorsModal = (author) => {
    setSelectedAuthor(author);
    setAuthorsModal(true);
  };
  // const handleAuthorsModalCardClick = author => {
  //     setSelectedAuthor(author);
  //     setAuthorsModal(true);
  //     setOpenModal(false);
  // }

  console.log(authorRecipes);
  console.log(
    "AUTHORS:",
    authors,
    " INGREDIENTS:",
    ingredients,
    " recipes:",
    recipes,
    "AUTHOR RECIPES",
    authorRecipes,
    "PROLIFIC AUTHORS:",
    prolificAuthors,
    "COMMON INGREDIENTS :",
    commonIngredints,
    "POSSIBLE SKILLLEVELS:",
    possibleSkillLevels,
  );

  const similarity = (currentRecipe) => {
    let similarRecipes = [];
    recipes.forEach((recipe) => {
      if (
        recipe.preparationTime.low / 60 -
          currentRecipe.preparationTime.low / 60 <=
          10 &&
        recipe.preparationTime.low / 60 -
          currentRecipe.preparationTime.low / 60 >
          0
      ) {
        similarRecipes.push({
          ...recipe,
          similarityFactor: "Preparation time",
        });
      }
    });
    return similarRecipes
      .slice(0, 5)
      .sort((first, second) => {
        first.preparationTime.low / 60 - second.preparationTime.low / 60;
      })

      .map((item, index) => {
        return (
          <div className="mt-8 dark:text-white" key={index}>
            <strong>{item.name}</strong>

            <p>{item.preparationTime.low / 60} minutes</p>
            <p>
              {item.preparationTime.low / 60 -
                currentRecipe.preparationTime.low / 60}{" "}
              minutes difference
            </p>
          </div>
        );
      });
  };

  return (
    <section className="custom-container">
      {checkedIngredients.length > 0 && (
        <div className="loading cstm-abs flex gap-1">
          <p>Recipes containing</p>
          {checkedIngredients.map((item, index) => (
            <strong className="loading" key={index}>
              {item}
            </strong>
          ))}
        </div>
      )}

      <Search value={searchTerm} setValue={setSearchTerm} />

      {selectedAuthor && (
        <Modal
          show={authorsModal}
          onClose={() => setAuthorsModal(false)}
          className="loading"
        >
          <Modal.Header> {selectedAuthor}'s recipes</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-4">
              {authorRecipes.map((author, index) => {
                if (author.author.trim() === selectedAuthor.trim()) {
                  return (
                    <div className="card dark:text-white">
                      <strong className="" key={index}>
                        {author.recipeName}
                      </strong>
                      <p>{author.description}</p>
                      <p>Ingredients: {author.ingredients.join(" ")}</p>

                      <div class="card-info">
                        {author.cookingTime.low !== 0 && (
                          <p>
                            Low cooking time:{" "}
                            <strong>
                              {author.cookingTime.low / 60} minutes
                            </strong>
                          </p>
                        )}
                        {author.cookingTime.high !== 0 && (
                          <p>
                            High cooking time:{" "}
                            <strong>
                              {author.cookingTime.low / 60} minutes
                            </strong>
                          </p>
                        )}
                        {author.preparationTime.low !== 0 && (
                          <p>
                            Low preparation time:{" "}
                            <strong>
                              {author.preparationTime.low / 60} minutes
                            </strong>
                          </p>
                        )}
                        {author.preparationTime.high !== 0 && (
                          <p>
                            High preparation time:{" "}
                            <strong>
                              {author.preparationTime.high / 60} minutes
                            </strong>
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }
              })}
            </div>

            <Button
              style={{ width: "100%", marginTop: "2rem" }}
              color="gray"
              onClick={() => setAuthorsModal(false)}
            >
              Close
            </Button>
          </Modal.Body>
        </Modal>
      )}

      {selectedRecipe && (
        <Modal
          show={openModal}
          onClose={() => setOpenModal(false)}
          className="loading"
        >
          <Modal.Header>{selectedRecipe.name}</Modal.Header>

          <Modal.Body>
            <div className="space-y-6 border-b border-gray-200">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                {selectedRecipe.description}
              </p>
              <div className="flex flex-col dark:text-white">
                <p>
                  Author:{" "}
                  <strong
                    onClick={() => handleAuthorsModal(selectedRecipe.author)}
                  >
                    {selectedRecipe.author}
                  </strong>
                </p>
                <p>Ingredients: {selectedRecipe.ingredients.join(", ")}</p>
                {selectedRecipe.preparationTime.low !== 0 && (
                  <p>
                    Low preparation time:{" "}
                    {selectedRecipe.preparationTime.low / 60} minutes
                  </p>
                )}
                {selectedRecipe.preparationTime.high !== 0 && (
                  <p>
                    High preparation time:{" "}
                    {selectedRecipe.preparationTime.high / 60} minutes
                  </p>
                )}
                {selectedRecipe.cookingTime.low !== 0 && (
                  <p>
                    Low cooking time: {selectedRecipe.cookingTime.low / 60}{" "}
                    minutes
                  </p>
                )}
                {selectedRecipe.cookingTime.high !== 0 && (
                  <p>
                    High cooking time:{" "}
                    <strong>
                      {selectedRecipe.cookingTime.high / 60} minutes
                    </strong>
                  </p>
                )}
                <p>Skill level: {selectedRecipe.skillLevel}</p>
              </div>
            </div>
            <p className="mt-4 text-center dark:text-white">
              Similar recipes based on preparation time:
            </p>
            {similarity(selectedRecipe).length !== 5 && (
              <p className="dark:text-white">
                Only found {similarity(selectedRecipe).length} recipes matching
                the criteria
              </p>
            )}
            {similarity(selectedRecipe)}
            <Button
              style={{ width: "100%", marginTop: "2rem" }}
              color="gray"
              onClick={() => setOpenModal(false)}
            >
              Close
            </Button>
          </Modal.Body>
        </Modal>
      )}

      <h5 className="cstm-m-t text-center">
        <strong>{recipes.length}</strong> Available recipes on page{" "}
        {currentPage}
      </h5>
      <CheckboxFilters
        sortingOrder={sortingOrder}
        setSortingOrder={setSortingOrder}
        possibleSkillLevels={possibleSkillLevels}
        skillLevels={skillLevels}
        setSkillLevels={setSkillLevels}
        setCheckedIngredients={setCheckedIngredients}
        checkedIngredients={checkedIngredients}
        ingredients={ingredients}
        recipes={recipes}
      />

      <SideTable
        commonIngrdients={commonIngredints}
        prolificAuthors={prolificAuthors}
        complicatedRecipes={complicatedRecipes}
        page={currentPage}
      />
      <div className="cards-container rounded">
        {filteredRecipes.map((item, index) => {
          return (
            <Card key={index} className="loading">
              <div className="border-b border-gray-200 tracking-tight text-gray-900 dark:text-white">
                <h5 className="text-2xl font-bold">{item.name}</h5>
                <p
                  style={{ cursor: "pointer" }}
                  onClick={() => handleAuthorsModal(item.author)}
                >
                  {" "}
                  by <strong>{item.author}</strong>{" "}
                </p>
              </div>
              <p>
                <strong>Ingredients: {item.ingredients.length}</strong>
              </p>

              <p>
                <strong> Skill level: {item.skillLevel}</strong>
              </p>
              <Button
                onClick={() => handleOpen(index)}
                gradientDuoTone="pinkToOrange"
              >
                See the detailed recipe
              </Button>
            </Card>
          );
        })}
      </div>

      <div className="mb-4 mt-2 flex overflow-x-auto sm:justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        />
      </div>
    </section>
  );
}
