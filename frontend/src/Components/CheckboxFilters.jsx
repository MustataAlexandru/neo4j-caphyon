import { Checkbox } from "flowbite-react";
import React from "react";

export default function CheckboxFilters({
  ingredients,
  checkedIngredients,
  setCheckedIngredients,
  possibleSkillLevels,
  skillLevels,
  setSkillLevels,
  sortingOrder,
  setSortingOrder
  
}) {
  const toggleIngredient = (ingredientName) => {
    setCheckedIngredients((prev) =>
      prev.includes(ingredientName)
        ? prev.filter((name) => name !== ingredientName)
        : [...prev, ingredientName],
    );
  };

  const toggleSkillLevel = (skillLevelName) => {
    setSkillLevels((prev) =>
      prev.includes(skillLevelName)
        ? prev.filter((name) => name !== skillLevelName)
        : [...prev, skillLevelName],
    );
  };

  const handleAsc = () => {
    if(sortingOrder === 'asc') {
      setSortingOrder('')
    } else setSortingOrder('asc')
  }
  const handleDesc = () => {
    if(sortingOrder === 'desc') {
      setSortingOrder('')
    } else setSortingOrder('desc')
  }
  
  console.log("SORTING ORDWER", sortingOrder);
  return (
    <div className="filter-container slide-in-left rounded border border-gray-200 shadow-md dark:border-gray-700">
      <div>
        <strong className="mb-2 text-center">
          Filter by number of ingredients
        </strong>
        <div className="filter-items">
          <p>Ascending</p>
          <Checkbox
          checked={sortingOrder === 'asc'}
          onClick={() => handleAsc()}
            
          />
          <p>Descending</p>
          <Checkbox
          checked={sortingOrder ==='desc'}
            onClick={() => handleDesc()}
          />
          
        </div>
        
      </div>
      <div>
        <strong className="mb-2 text-center">Filter by skill level</strong>
        {possibleSkillLevels.map((skillLevel) => {
          return (
            <div className="filter-items">
              <p>{skillLevel}</p>
              <Checkbox
                onChange={() => toggleSkillLevel(skillLevel)}
                checked={skillLevels.includes(skillLevel)}
              
              />
            </div>
          );
        })}
      </div>
      <div>
        <strong className="mb-2 text-center">Filter by ingredients</strong>
        {ingredients.map((ingredient) => {
          return (
            <div className="filter-items">
              <p>{ingredient.name}</p>
              <Checkbox
                onChange={() => toggleIngredient(ingredient.name)}
                checked={checkedIngredients.includes(ingredient.name)}
                id={ingredient.name}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
