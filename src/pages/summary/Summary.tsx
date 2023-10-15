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

export default function Summary() {
  const navigate = useNavigate()
  
  const { pizzaSize, pizzaFlavour, setPizzaOrder } = useContext(OrderContext)
  const [ summaryData, setSummaryData ] = useState({})
  const [ summaryAmount, setSummaryAmount ] = useState(0)

  const handleBack = () => {
    navigate(-1)
  }

  const handleNext = () => {
    const payload = {
      item: {
        name: summaryData.name,
        image: summaryData.image,
        size: summaryData.text,
        slices: summaryData.slices,
        value: summaryData.price,
      },
      total: summaryAmount,
    }

    setPizzaOrder(payload)
    navigate(routes.checkout)
  }
  
  useEffect(() => {
    if (!pizzaFlavour) {
      return navigate(routes.pizzaFlavour);
    }
  
    if (!pizzaSize) {
      return navigate(routes.home);
    }
  
    let totalPrice = 0;
    let name = '';
  
    if (Array.isArray(pizzaFlavour) && pizzaFlavour.length >= 1) {
      if (pizzaFlavour.length === 2) {
        
        // Para dois sabores
        name = `${pizzaFlavour[0][0].name} e ${pizzaFlavour[1][0].name}`;
        totalPrice = Math.max(
          pizzaFlavour[0][0]?.price?.[pizzaSize[0].slices] || 0,
          pizzaFlavour[1][0]?.price?.[pizzaSize[0].slices] || 0
        );
      } else {
        // Para um sabor
        name = pizzaFlavour[0].name;
        totalPrice = pizzaFlavour[0]?.price?.[pizzaSize[0].slices] || 0;
      }
    }
  
    setSummaryData({
      text: pizzaSize[0].text,
      slices: pizzaSize[0].slices,
      name: name,
      price: totalPrice,
      image: pizzaFlavour[0]?.image || ''
    });
  }, [pizzaFlavour, pizzaSize]);
  useEffect(() => {
    setSummaryAmount(summaryData.price)
  }, [summaryData])
  
  return (
    <Layout>
      <Title tabIndex={0}>Resumo do pedido</Title>
      <SummaryContentWrapper>
        <SummaryDetails>
          <SummaryImage  src={summaryData.image} alt="" width="200px"/>
          <SummaryTitle>{summaryData.name}</SummaryTitle>
          <SummaryDescription>{summaryData.text} {`(${summaryData.slices}) pedaços`}</SummaryDescription>
          <SummaryPrice>
            {convertToCurrency(summaryData.price)}
          </SummaryPrice>
        </SummaryDetails>
        <SummaryAmount>
          <SummaryPrice>{convertToCurrency(summaryAmount)}</SummaryPrice>
        </SummaryAmount>
      </SummaryContentWrapper>
      <SummaryActionWrapper>
        <Button inverse="inverse" onClick={handleBack}>
          Voltar
        </Button>
        <Button onClick={handleNext}>Ir para o pagamento</Button>
      </SummaryActionWrapper>
    </Layout>
  )
}
