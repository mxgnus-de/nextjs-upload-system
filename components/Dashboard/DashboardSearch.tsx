import CloseIcon from '@mui/icons-material/Close';
import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

function DashboardSearch({
   searchValue,
   searchChange,
}: {
   searchValue: string;
   searchChange: (searchID: string) => void;
}) {
   return (
      <SearchWrapper>
         <div>
            <input
               type='text'
               value={searchValue}
               placeholder='Search'
               onChange={(e) => {
                  searchChange(e.target.value);
               }}
            />
            <CloseIcon className='pointer' onClick={() => searchChange('')} />
         </div>
      </SearchWrapper>
   );
}

const SearchWrapper = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   margin: 0.4rem 0;
   background-color: #fff;
   border-radius: 0.5rem;

   input {
      border: none;
      font-size: 1.2rem;
   }

   div {
      padding: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;

      * {
         padding: 0.3rem;
      }

      svg {
         path {
            color: #767676;
         }
         height: 2rem;
         width: 2rem;
      }
   }
`;

export default DashboardSearch;
