import styled from 'styled-components';
import { Ingredient } from '../types';

const IngredientsContainer = styled.div`
  margin: 20px 0;
`;

const IngredientsTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #333;
`;

const IngredientsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const IngredientItem = styled.li`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #c5b510;

  &:last-child {
    border-bottom: none;
  }
`;

const IngredientName = styled.span`
  flex: 1;
  font-weight: 500;
`;

const IngredientMeasure = styled.span`
  color: #666;
  font-style: italic;
`;

interface IngredientsListProps {
  ingredients: Ingredient[];
  title?: string;
}

export default function IngredientsListComponent({
  ingredients,
  title = 'Інгредієнти'
}: IngredientsListProps) {
  if (!ingredients.length) {
    return null;
  }

  return (
    <IngredientsContainer>
      <IngredientsTitle>{title}</IngredientsTitle>
      <IngredientsList>
        {ingredients.map((ingredient, index) => (
          <IngredientItem key={index}>
            <IngredientName>{ingredient.name}</IngredientName>
            <IngredientMeasure>{ingredient.measure}</IngredientMeasure>
          </IngredientItem>
        ))}
      </IngredientsList>
    </IngredientsContainer>
  );
} 