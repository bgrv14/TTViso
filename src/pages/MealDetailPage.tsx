import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMealById } from '../api/mealApi';
import { useSelectedMeals } from '../context/SelectedMealsContext';
import styled from 'styled-components';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  color: #5e3023;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const MealHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MealImage = styled.img`
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const MealInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MealTitle = styled.h1`
  font-size: 2.5rem;
  color: #5e3023;
  margin: 0;
`;

const MealMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MetaItem = styled.div`
  font-size: 1.1rem;
  
  strong {
    color: #5e3023;
  }
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #5e3023;
  margin-bottom: 20px;
  border-bottom: 2px solid #c5b510;
  padding-bottom: 10px;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  ${props => props.primary ? `
    background-color: #c5b510;
    color: white;
    
    &:hover {
      background-color: #a69a0d;
    }
  ` : `
    background-color: #f0f0f0;
    color: #333;
    
    &:hover {
      background-color: #e0e0e0;
    }
  `}
`;

const IngredientsList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
`;

const IngredientItem = styled.li`
  display: flex;
  align-items: center;
  padding: 8px;
  border: 1px solid #c5b510;
  border-radius: 4px;
`;

const IngredientName = styled.span`
  font-weight: 500;
  margin-right: 5px;
`;

const IngredientMeasure = styled.span`
  color: #666;
  font-style: italic;
`;

const Instructions = styled.div`
  line-height: 1.6;
  color: #333;
  white-space: pre-line;
`;

const VideoContainer = styled.div`
  margin-top: 30px;
`;

const VideoEmbed = styled.iframe`
  width: 100%;
  height: 400px;
  border: none;
  border-radius: 8px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #e74c3c;
`;

export default function MealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { add, remove, isSelected } = useSelectedMeals();
  
  const { 
    data: meal, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['meal', id],
    queryFn: () => getMealById(id || ''),
    enabled: !!id
  });

  const isInSelectedMeals = meal ? isSelected(meal.idMeal) : false;

  const handleToggleSelect = () => {
    if (!meal) return;
    
    if (isInSelectedMeals) {
      remove(meal.idMeal);
    } else {
      add(meal);
    }
  };

  const getYoutubeEmbedUrl = (youtubeUrl: string) => {
    const videoId = youtubeUrl.split('v=')[1];
    if (!videoId) return null;
    
    const ampersandPosition = videoId.indexOf('&');
    const actualVideoId = ampersandPosition !== -1 
      ? videoId.substring(0, ampersandPosition) 
      : videoId;
    
    return `https://www.youtube.com/embed/${actualVideoId}`;
  };

  if (isLoading) {
    return <LoadingMessage>Завантаження рецепту...</LoadingMessage>;
  }

  if (error || !meal) {
    return <ErrorMessage>Помилка завантаження рецепту. Спробуйте пізніше.</ErrorMessage>;
  }

  return (
    <PageContainer>
      <BackLink to="/">&larr; Назад до списку рецептів</BackLink>
      
      <MealHeader>
        <MealImage src={meal.strMealThumb} alt={meal.strMeal} />
        
        <MealInfo>
          <MealTitle>{meal.strMeal}</MealTitle>
          
          <MealMeta>
            <MetaItem><strong>Категорія:</strong> {meal.strCategory}</MetaItem>
            <MetaItem><strong>Регіон:</strong> {meal.strArea}</MetaItem>
            {meal.strTags && (
              <MetaItem><strong>Теги:</strong> {meal.strTags}</MetaItem>
            )}
          </MealMeta>
          
          <Button primary onClick={handleToggleSelect}>
            {isInSelectedMeals ? 'Видалити з вибраних' : 'Додати до вибраних'}
          </Button>
        </MealInfo>
      </MealHeader>
      
      <Section>
        <SectionTitle>Інгредієнти</SectionTitle>
        <IngredientsList>
          {meal.ingredients.map((ingredient, index) => (
            <IngredientItem key={index}>
              <IngredientName>{ingredient.name}</IngredientName>
              <IngredientMeasure>({ingredient.measure})</IngredientMeasure>
            </IngredientItem>
          ))}
        </IngredientsList>
      </Section>
      
      <Section>
        <SectionTitle>Інструкції</SectionTitle>
        <Instructions>{meal.strInstructions}</Instructions>
      </Section>
      
      {meal.strYoutube && (
        <VideoContainer>
          <SectionTitle>Відео</SectionTitle>
          <VideoEmbed 
            src={getYoutubeEmbedUrl(meal.strYoutube) || ''} 
            title={`Відео рецепту ${meal.strMeal}`}
            allowFullScreen
          />
        </VideoContainer>
      )}
    </PageContainer>
  );
} 