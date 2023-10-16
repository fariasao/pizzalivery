import { Layout } from "../../components/layout/Layout";
import { Button } from "../../components/button/Button";
import { Title } from "../../components/title/Title";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";
import { useContext, useEffect, useState } from "react";
import OrderContext from "../../contexts/OrderContext";

import Mussarela from "../../assets/pizza-flavours/mucarela.png";
import ChickenWithCheese from "../../assets/pizza-flavours/frango-catupiry.png";
import Margherita from "../../assets/pizza-flavours/margherita.png";
import Lusa from "../../assets/pizza-flavours/portuguesa.png";

import { convertToCurrency } from "../../helpers/convertToCurrency";

import {
  FlavourActionWrapper,
  FlavourCard,
  FlavourCardDescription,
  FlavourCardImage,
  FlavourCardPrice,
  FlavourCardTitle,
  FlavourContentWrapper,
} from "./Flavours.style";

export default function Flavours() {
  const navigate = useNavigate();
  const { pizzaSize, pizzaFlavour, setPizzaFlavour } = useContext(OrderContext);
  // const [flavourId, setFlavourId] = useState("");
  const [selectedFlavours, setSelectedFlavours] = useState([]);
  console.log(pizzaSize);

  const flavoursOptions = [
    {
      id: "10",
      image: Mussarela,
      name: "Mussarela",
      description:
        "Muçarela especial fresca, finalizada com orégano e azeitonas portuguesas.",
      price: {
        "8": 71,
        "4": 35.5,
        "1": 18,
      },
    },
    {
      id: "11",
      image: ChickenWithCheese,
      name: "Frango com catupiry",
      description:
        "Peito de frango cozido, desfiado e refogado em azeite de oliva e temperos naturais, anéis de cebola sobre base de muçarela especial, bacon em cubos e Catupiry® gratinado. É finalizada com orégano.",
      price: {
        "8": 95,
        "4": 47.5,
        "1": 24,
      },
    },
    {
      id: "12",
      image: Margherita,
      name: "Margherita",
      description:
        "Muçarela especial, muçarela de búfala rasgada, fatias de tomate finalizada com folhas de manjericão orgânico e um fio de azeite aromatizado.",
      price: {
        "8": 90,
        "4": 45,
        "1": 22.5,
      },
    },
    {
      id: "13",
      image: Lusa,
      name: "Portuguesa",
      description:
        "Clássica pizza, leva presunto magro, cebola, palmito e ervilha sobre base de muçarela fresca. Finalizada com cobertura de ovos, orégano e azeitonas portuguesas. ",
      price: {
        "8": 93,
        "4": 46.5,
        "1": 23.5,
      },
    },
  ];

  const getPizzaFlavour = (id: string) => {
    return flavoursOptions.find((flavour) => flavour.id === id);
  };

  const handleFlavourClick = (id) => {
    if (selectedFlavours.includes(id)) {
      setSelectedFlavours(
        selectedFlavours.filter((selectedId) => selectedId !== id)
      );
    } else {
      setSelectedFlavours([...selectedFlavours, id]);
    }
  };

  const handleBack = () => {
    navigate(routes.pizzaSize);
  };

  const handleNext = () => {
    if (selectedFlavours.length === 0) {
      alert("Por favor, selecione pelo menos um sabor de pizza.");
      return;
    }

    const selectedFlavoursData = selectedFlavours.map(getPizzaFlavour);
    setPizzaFlavour(selectedFlavoursData);
    navigate(routes.summary);
  };

  useEffect(() => {
    if (!pizzaFlavour) return;
    setSelectedFlavours(pizzaFlavour.map((flavour) => flavour.id));
  }, [pizzaFlavour]);

  return (
    <Layout>
      <Title tabIndex={0}>Escolha o(s) sabor(es) da sua pizza</Title>
      <FlavourContentWrapper>
        {flavoursOptions.map(({ id, image, name, description, price }) => (
          <FlavourCard key={id} selected={selectedFlavours.includes(id)}>
            <FlavourCardImage src={image} alt={name} width="200px" />
            <FlavourCardTitle>{name}</FlavourCardTitle>
            <FlavourCardDescription>{description}</FlavourCardDescription>
            <FlavourCardPrice>
              {convertToCurrency(price[pizzaSize[0].slices])}
            </FlavourCardPrice>
            <Button onClick={() => handleFlavourClick(id)}>
              {selectedFlavours.includes(id) ? "Selecionado" : "Selecionar"}
            </Button>
          </FlavourCard>
        ))}
      </FlavourContentWrapper>
      <FlavourActionWrapper>
        <Button inverse="inverse" onClick={handleBack}>
          Voltar
        </Button>
        <Button onClick={handleNext}>Seguir para o resumo</Button>
      </FlavourActionWrapper>
    </Layout>
  );
}
