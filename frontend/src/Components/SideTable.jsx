import React from "react";
import { Card } from "flowbite-react";

export default function SideTable({
  complicatedRecipes,
  page,
  prolificAuthors,
  commonIngrdients,
}) {
  return (
    <div className="featured-container slide-in-right rounded border border-gray-200 p-2 dark:border-gray-700">
      <div className="prolific-authors">
        <strong className="mb-2 text-center text-xl">
          Most dedicated authors{" "}
        </strong>
        {prolificAuthors.map((item, index) => {
          return (
            <div key={index} className="common-ingredients">
              <strong>On place number {index + 1}</strong>
              <strong>
                {item.name} with {item.count} recipes
              </strong>
              {item.recipes.map((item, index) => {
                return (
                  <p>
                    <strong>{index + 1}</strong> {item}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="common-ingredients">
        <strong className="mb-2 text-center text-xl">
          Most common ingredients
        </strong>
        {commonIngrdients.map((item, index) => {
          return (
            <p key={index}>
              <strong>{item.ingredient}</strong> has been found in {item.count}{" "}
              recipes.
            </p>
          );
        })}
      </div>

      <strong className="mt-2 text-center dark:text-white">
        Most complicated recipes on page number {page}
      </strong>
      {complicatedRecipes.map((item, index) => {
        return (
          <Card
            key={index}
            style={{ minWidth: "100%;" }}
            className="loading flex flex-col gap-2"
          >
            <div className="featured-card border-b border-gray-200 tracking-tight text-gray-900 dark:text-white">
              <h5 className="text-2xl font-bold">{item.name}</h5>
              <p>
                {" "}
                by <strong>{item.author}</strong>{" "}
              </p>
            </div>
            <p>
              <strong>Ingrediente: {item.ingredients.length}</strong>
            </p>

            <p>
              <strong> Skill level: {item.skillLevel}</strong>
            </p>
          </Card>
        );
      })}
    </div>
  );
}
