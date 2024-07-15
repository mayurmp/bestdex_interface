import React from 'react'
import styled from 'styled-components/macro'
import connectlogo from '../../assets/svg/connect.svg'
import { Link } from 'react-router-dom'

// const HeaderLogo = styled.div`
//   // border: 1px solid red;
//   // background: lightgray;
//   width: 100%;
//   height: 83px;
//   display: flex;
//   justify-content: center;
//   height: 83px;
//   padding: 16px 120px 16px 114px;
//   @media screen and (max-width: 800px) {
//     display: flex;
//     justify-content: center;
//     height: 56px;
//     padding: 12px 9px 13px 6px;
//   }
// `
const DescriptionDiv = styled.div`
  min-height: 91vh;
  margin-top: 83px;
  // border: 1px solid red;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const CoLogoDivBg = styled.div`
  width: 60px;
  height: 60px;
  padding: 8.5px;
  border-radius: 36.656px;
  background: #e6e6e6;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 800px) {
    width: 32px;
    height: 32px;
    padding: 4px;
    border-radius: 18px;
  }
`

const TextNum = styled.p`
  color: #e6e6e6;
  font-family: Poppins;
  font-size: 190px;
  font-style: normal;
  font-weight: 500;
  // line-height: normal;
  letter-spacing: -7.6px;

  @media screen and (max-width: 800px) {
    font-size: 100px;
    letter-spacing: -4px;
  }
`
const TextPNF = styled.p`
  color: #e6e6e6;
  text-align: center;
  font-family: Poppins;
  font-size: 24px; // 5vw
  font-style: normal;
  font-weight: 600;
  // line-height: normal;
  text-transform: uppercase;
  @media screen and (max-width: 800px) {
    font-size: 13px;
  }
`
const TextBtnDiv = styled.div`
  // width: 155px;
  height: 51px;
  padding: 16px 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 45px;
  border-radius: 100px;
  border: 2px solid #5a63ff;
  background: #5a63ff;
`
const TextBtn = styled.p`
  color: #fff;
  text-align: center;
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  // line-height: normal;
`
const PageNotFound = () => {
  return (
    <>
      <div>
        <DescriptionDiv>
          <CoLogoDivBg>
            <img src={connectlogo} width={'100%'} alt="logo" />
          </CoLogoDivBg>
          <div>
            <TextNum>404</TextNum>
          </div>
          <div>
            <TextPNF>page not found</TextPNF>
          </div>
          <div>
            <Link to={'/home'}>
              <TextBtnDiv>
                <TextBtn>BACK HOME</TextBtn>
              </TextBtnDiv>
            </Link>
          </div>
        </DescriptionDiv>
      </div>
    </>
  )
}

export default PageNotFound
