import Header from './Header';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import Categories from './Categories';
import {FaHeart, FaRegHeart} from 'react-icons/fa';
import './Home.css';

function Home() {
    const navigate = useNavigate();
    const [cproducts, setcproducts] = useState([]);
    const [products, setproducts] = useState([]);
    const [likedproducts, setlikedproducts] = useState([]);
    const [search, setsearch] = useState('');
    const [ refresh,setrefresh ] = useState(false);
    const [issearch, setissearch] = useState(false);

    useEffect(() => {
        const url = 'http://localhost:4000/get-products';
        axios.get(url)
            .then((res) => {
                if (res.data.products) {
                    setproducts(res.data.products);
                }
            })
            .catch((err) => {
                alert('Error fetching products');
            });

            const url2 = 'http://localhost:4000/liked-products';
            let data= { userId: localStorage.getItem('userId')}
            axios.post(url2,data)
            .then((res) => {
                if (res.data.products) {
                    setlikedproducts(res.data.products);
                }
            })
            .catch((err) => {
                alert('Error fetching liked-products');
            });

    }, [refresh]);

    const handlesearch = (value) => {
        setsearch(value);
    }

    const handleClick = () => {
        const url = 'http://localhost:4000/search?search=' + search + '&loc=' + localStorage.getItem('userLoc');
        axios.get(url)
            .then((res) => {
                setcproducts(res.data.products);
                setissearch(true);
            })
            .catch((err) => {
                alert('Error during search');
            });
    }

    const handleCategory = (value) => {
        let filteredProducts = products.filter((item) => {
            if (item.category.toLowerCase() === value.toLowerCase()) {
                return item;
            }
        });
        setcproducts(filteredProducts);
    }

    const handleLike = (productId, e) => {
        e.stopPropagation();
        let userId = localStorage.getItem('userId');

        if (!userId) {
            alert('Please Login first');
            return;
        }

        const url = 'http://localhost:4000/like-product';
        const data = {userId, productId};
        axios.post(url, data)
            .then((res) => {
                alert('Liked product');
                setrefresh(!refresh)
            })
            .catch((err) => {
                console.log(err);
                alert('Error liking product');
            });
    }

    const handleDisLike = (productId, e) => {
        e.stopPropagation();
        let userId = localStorage.getItem('userId');

        if (!userId) {
            alert('Please Login first');
            return;
        }

        const url = 'http://localhost:4000/dislike-product';
        const data = {userId, productId};
        axios.post(url, data)
            .then((res) => {
                alert('Removed from favourites');
                setrefresh(!refresh)
            })
            .catch((err) => {
                console.log(err);
                alert('Error liking product');
            });
    }


    const handleProduct = (id) => {
        navigate('/product/' + id);
    }

    return (
        <div>
            <Header search={search} handlesearch={handlesearch} handleClick={handleClick}/>
            <Categories handleCategory={handleCategory}/>
            {issearch && cproducts && <h5>Search Results
                <button className="clear-btn" onClick={() => setissearch(false)}>Clear</button>
            </h5>}
            {issearch && cproducts && cproducts.length === 0 && <h5>No Results Found</h5>}
            {issearch && <div className="d-flex justify-content-center flex-wrap">
                {cproducts && cproducts.length > 0 &&
                    cproducts.map((item) => {
                        return (
                            <div onClick={() => handleProduct(item._id)} key={item._id} className="card m-3">
                                <div onClick={(e) => handleLike(item._id, e)} className="icon-con">
                                    <FaRegHeart className="icons"/>
                                </div>
                                <img width="250px" height="170px" src={'http://localhost:4000/' + item.pimage}/>
                                <h3 className="m-2 price-text">Rs. {item.price} /-</h3>
                                <p className="m-2">{item.pname} | {item.category}</p>
                                <p className="m-2 text-success">{item.pdesc}</p>
                            </div>
                        )
                    })
                }
            </div>}
            {!issearch && <div className="d-flex justify-content-center flex-wrap">
                {products && products.length > 0 &&
                    products.map((item) => {
                        return (
                            <div onClick={() => handleProduct(item._id)} key={item._id} className="card m-3">
                                <div className="icon-con">
                                    {
                                       likedproducts.find((likedItem)=>likedItem._id===item._id)?
                                       <FaRegHeart onClick={(e) => handleDisLike(item._id, e)} className="red-icons"/>: 
                                       <FaRegHeart onClick={(e) => handleLike(item._id, e)}  className="icons"/>
                                       
                                    }
                                </div>
                                <img width="250px" height="170px" src={'http://localhost:4000/' + item.pimage}/>
                                <h3 className="m-2 price-text">Rs. {item.price} /-</h3>
                                <p className="m-2">{item.pname} | {item.category}</p>
                                <p className="m-2 text-success card-desc">{item.pdesc}</p>
                            </div>
                        )
                    })
                }
            </div>}
        </div>
    );
}

export default Home;
