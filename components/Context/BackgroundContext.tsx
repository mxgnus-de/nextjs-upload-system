import React, { useState, useContext, createContext } from 'react';
import styled from 'styled-components';

export interface BackgroundProviderProps {
   children?: any;
}

export interface Background {
   show: boolean;
   blur?: boolean;
   color?: string;
}

export interface BackgroundUpdate {
   setBackground: React.Dispatch<React.SetStateAction<Background>>;
}

const BackgroundContext = createContext<Background>({
   show: false,
});
const BackgroundUpdateContext = createContext<BackgroundUpdate>(
   {} as BackgroundUpdate,
);

export function useBackground() {
   return useContext(BackgroundContext);
}

export function useBackgroundUpdate() {
   return useContext(BackgroundUpdateContext);
}

export function BackgroundProvider(props: BackgroundProviderProps) {
   const [background, setBackground] = useState<Background>({
      show: false,
   });

   return (
      <BackgroundContext.Provider value={background}>
         <BackgroundUpdateContext.Provider value={{ setBackground }}>
            {props.children}
            <Background
               show={background.show}
               blur={background.blur}
               color={background.color}
            />
         </BackgroundUpdateContext.Provider>
      </BackgroundContext.Provider>
   );
}

interface BackgroundProps {
   show: boolean;
   blur?: boolean;
   color?: string;
}

const Background = styled.div<BackgroundProps>`
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background-color: ${(props) =>
      props.color ? props.color : 'rgba(0, 0, 0, 0.7)'};
   z-index: 100;
   opacity: ${(props) => (props.show ? 1 : 0)};
   transition: opacity 0.3s ease-in-out;
   pointer-events: ${(props) => (props.show ? 'auto' : 'none')};
   filter: ${(props) => (props.blur ? 'blur(10px)' : '')};
`;
