import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import OrderContext from "../../contexts/OrderContext";

import { Button } from "../../components/button/Button";
import { Layout } from "../../components/layout/Layout";
import { Title } from "../../components/title/Title";
import { convertToCurrency } from "../../helpers/convertToCurrency";
import {
  SummaryActionWrapper,
  SummaryAmount,
  SummaryContentWrapper,
  SummaryDescription,
  SummaryDetails,
  SummaryImage,
  SummaryPrice,
  SummaryTitle,
} from "./Summary.style"
import { routes } from "../../routes";

interface PizzaFlavour {
  id: string;
  name: string;
  image: string;
  price: { [key: string]: number };
}

export default function Summary() {
  const navigate = useNavigate();

  const { pizzaSize, pizzaFlavour, setPizzaOrder } = useContext(OrderContext);
  const [summaryData, setSummaryData] = useState<PizzaFlavour[]>([]);
  const [summaryAmount, setSummaryAmount] = useState<number>(0);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNext = () => {
    const payload = {
      item: {
        name: summaryData.map((item) => item.name),
        size: pizzaSize[0].text,
        slices: pizzaSize[0].slices,
        value: summaryAmount,
      },
    };

    setPizzaOrder(payload);
    navigate(routes.checkout);
  };

  const handleAdd = () => {
    navigate(routes.pizzaFlavour);
  }

  useEffect(() => {
    if (!pizzaFlavour || !pizzaSize) {
      return navigate(routes.pizzaFlavour);
    }

    const selectedFlavours = pizzaFlavour.map((flavour) => ({
      ...flavour,
      quantity: pizzaFlavour.filter((fla) => fla.id === flavour.id).length,
    }));
    
    const listSummary = new Map();
    for (const flavour of selectedFlavours) {
      if (listSummary.has(flavour.id)) {
        listSummary.get(flavour.id).quantity += 1;
      } else {
        listSummary.set(flavour.id, { ...flavour, quantity: 1 });
      }
    }

    const summaryArray = Array.from(listSummary.values());
    
    const totalAmount = summaryArray.reduce((total, flavour) => {
      let priceForSlices = flavour.price[pizzaSize[0].slices];
      
      console.log(flavour.name);
      
      if (["1/2 Mussarela", "1/2 Frango com Catupiry", "1/2 Margherita", "1/2 Portuguesa"].includes(flavour.name)) {
        return priceForSlices = Math.max(flavour.price[pizzaSize[0].slices]);
      }
  
      return total + priceForSlices * flavour.quantity;
    }, 0);

    setSummaryData(summaryArray);
    setSummaryAmount(totalAmount);
  }, [pizzaFlavour, pizzaSize, navigate]);

  return (
    <Layout>
      <Title tabIndex={0}>Resumo do pedido</Title>
      <SummaryContentWrapper>
        {summaryData.map((item, index) => (
          <SummaryDetails key={index}>
            <SummaryImage src={item.image} alt={item.name} />
            <SummaryTitle>{item.name}</SummaryTitle>
            <SummaryDescription>{pizzaSize[0].text} ({pizzaSize[0].slices} pedaços)
            </SummaryDescription>
            <SummaryPrice>
              {convertToCurrency(item.price[pizzaSize[0].slices])}
            </SummaryPrice>
          </SummaryDetails>
        ))}
        <SummaryAmount>
          <SummaryPrice>{convertToCurrency(summaryAmount)}</SummaryPrice>
        </SummaryAmount>
      </SummaryContentWrapper>
      <SummaryActionWrapper>
        <Button inverse="inverse" onClick={handleBack}>
          Voltar
        </Button>
        <Button onClick={handleAdd}>Adicionar mais pizzas</Button>
        <Button onClick={handleNext}>Ir para o pagamento</Button>
      </SummaryActionWrapper>
    </Layout>
  );
}