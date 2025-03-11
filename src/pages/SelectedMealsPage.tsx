import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useSelectedMeals } from '../context/SelectedMealsContext';
import MealCard from '../components/MealCard';
import { Ingredient } from '../types';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
  color: #333;
  text-align: center;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  color: 5e3023;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
`;

const MealsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const SummarySection = styled.section`
  margin-top: 40px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
  border-bottom: 2px solid #c5b510;
  padding-bottom: 10px;
`;

const IngredientsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const IngredientItem = styled.li`
  display: flex;
  align-items: center;
  padding: 10px;
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

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  background-color: #e74c3c;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 20px;
  
  &:hover {
    background-color: #c0392b;
  }
`;

export default function SelectedMealsPage() {
  const { meals, clear } = useSelectedMeals();
  
  const combinedIngredients = meals.reduce((acc: Ingredient[], meal) => {
    meal.ingredients.forEach(ingredient => {
      const existingIngredient = acc.find(i => 
        i.name.toLowerCase() === ingredient.name.toLowerCase()
      );
      
      if (existingIngredient) {
        existingIngredient.measure = `${existingIngredient.measure}, ${ingredient.measure}`;
      } else {
        acc.push({ ...ingredient });
      }
    });
    
    return acc;
  }, []);
  
  const sortedIngredients = [...combinedIngredients].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  if (meals.length === 0) {
    return (
      <PageContainer>
        <BackLink to="/">&larr; Назад до списку рецептів</BackLink>
        <PageTitle>Вибрані рецепти</PageTitle>
        <EmptyMessage>
          У вас немає вибраних рецептів. 
          <br />
          <Link to="/">Перейти до списку рецептів</Link>
        </EmptyMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackLink to="/">&larr; Назад до списку рецептів</BackLink>
      <PageTitle>Вибрані рецепти</PageTitle>
      
      <Button onClick={clear}>Очистити всі вибрані рецепти</Button>
      
      <MealsGrid>
        {meals.map(meal => (
          <MealCard key={meal.idMeal} meal={meal} />
        ))}
      </MealsGrid>
      
      <SummarySection>
        <SectionTitle>Сумарний список інгредієнтів</SectionTitle>
        <IngredientsList>
          {sortedIngredients.map((ingredient, index) => (
            <IngredientItem key={index}>
              <IngredientName>{ingredient.name}</IngredientName>
              <IngredientMeasure>{ingredient.measure}</IngredientMeasure>
            </IngredientItem>
          ))}
        </IngredientsList>
      </SummarySection>
      
      <SummarySection>
        <SectionTitle>Інструкції з приготування</SectionTitle>
        {meals.map(meal => (
          <div key={meal.idMeal}>
            <h3>{meal.strMeal}</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{meal.strInstructions}</p>
          </div>
        ))}
      </SummarySection>
    </PageContainer>
  );
} 