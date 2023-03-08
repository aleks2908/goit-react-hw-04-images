import { useState, useEffect } from 'react';
import 'modern-normalize';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { toast } from 'react-toastify';

import { Searchbar } from '../Searchbar/Searchbar';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { ToastContainer } from 'react-toastify';
import { Loader } from 'components/Loader/Loader';
import { Button } from '../Button/Button';
import css from './App.module.css';

export const App = () => {
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMoreBtnHidden, setIsLoadMoreBtnHidden] = useState(false);

  useEffect(() => {
    if (!searchValue) {
      return;
    }

    setIsLoading(true);
    setIsLoadMoreBtnHidden(false);

    async function fetchData() {
      const BASE_URL = 'https://pixabay.com/api/';
      const MY_KEY = '32804952-bc7fa4c68d10a619b16622bc9';

      try {
        const resp = await axios.get(
          `${BASE_URL}?q=${searchValue}&page=${page}&key=${MY_KEY}&image_type=photo&orientation=horizontal&per_page=12`
        );

        let totalHits = resp.data.totalHits;

        if (totalHits === 0) {
          toast.error(
            'Sorry, there are no images matching your search query. Please try again.',
            {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'dark',
            }
          );
          setIsLoading(false);
          setItems([]);
          return;
        } else {
          if (page === 1) {
            setItems([...resp.data.hits]);
          } else {
            setItems(prevState => [...prevState, ...resp.data.hits]);
          }
          setIsLoading(false);
        }

        if (page * 12 >= totalHits) {
          setIsLoadMoreBtnHidden(true);
          toast.success("You've reached the end of search results.", {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [page, searchValue]);

  const handleFormSubmit = searchValue => {
    setSearchValue(searchValue);
    setPage(1);
  };

  const btnLoadMoreClick = () => {
    setIsLoading(true);
    setPage(prevState => prevState + 1);
  };

  return (
    <>
      <Searchbar onSubmit={handleFormSubmit} />
      {isLoading && (
        <div className={css.vortexWrapper}>
          <Loader />
        </div>
      )}

      <ImageGallery items={items} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {items.length !== 0 && (
        <div hidden={isLoadMoreBtnHidden} className={css.vortexWrapper}>
          {!isLoading ? <Button onClick={btnLoadMoreClick} /> : <Loader />}
        </div>
      )}
    </>
  );
};
