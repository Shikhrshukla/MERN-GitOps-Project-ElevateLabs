    
// Addreviewpage


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/Header';
import dummyImage from '../assets/images/placeholder.jpg';
import { jwtDecode } from 'jwt-decode';
import Reviewcard from '../components/Reviewcard'; 

const Addreviewpage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0); 
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [starCounts, setStarCounts] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    const [totalUsers, setTotalUsers] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const userEmail = getUserEmail();

    const imageUrl = product?.imagePath ? `/api/${product.imagePath}` : dummyImage;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data);
                    setReviews(data.reviews || []); 
                    updateRatingData(data.reviews); 
                } else {
                    throw new Error('Failed to fetch product');
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [id]);

    const updateRatingData = (reviews) => {
        const newStarCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let newTotalUsers = 0;

        reviews.forEach(review => {
            const rating = review.rating; 
            if (rating >= 1 && rating <= 5) {
                newStarCounts[rating] += 1;
                newTotalUsers += 1;
            }
        });

        setStarCounts(newStarCounts);
        setTotalUsers(newTotalUsers);
        setAverageRating(calculateAverageRating(newStarCounts, newTotalUsers));
    };

    const submitReview = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token'); 

        try {
            const res = await fetch(`/api/products/view-review/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    reviewText,
                    rating, 
                    userEmail: userEmail
                }),
            });

            if (res.ok) {
                const updatedProduct = await res.json();
                setReviews(updatedProduct.reviews); 
                updateRatingData(updatedProduct.reviews); 
                toast.success('Review added successfully');
                setReviewText(''); 
                setRating(0); 
                navigate('/user-home/reviewed-products', { state: { reviewedProduct: updatedProduct } });
            } else {
                toast.error('Failed to add review');
            }
        } catch (error) {
            console.error('Error adding review:', error);
            toast.error('Failed to add review');
        }
    };

    const handleStarClick = (value) => {
        setRating(value); 
        toast.success('Thanks for rating!');
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
           
            <form className="block space-y-6 mx-auto my-12 bg-white p-8 md:p-12 shadow-2xl rounded-lg max-w-3xl" 
                onSubmit={submitReview}>
                 <p className="text-3xl font-sans font-semibold">{product.productName}</p>
                <div className='flex gap-6'>
                    <div>
                        <img src={imageUrl} alt="Product" className="h-48 max-w-fit border border-none rounded-lg" />
                    </div>
                    
                    <div>
                       
                        <p className="text-lg font-sans font-bold">Category :{product.category}</p><br />
                        <p className="text-lg font-sans font-bold">{product.description}</p><br />
                        <p className="text-3xl font-sans text-red-500">Price: {product.price}</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-4">Rate this product</h2> 
                <div>
                    
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => handleStarClick(star)}
                            style={{
                                cursor: 'pointer',
                                fontSize: '24px',
                                color: star <= rating ? 'gold' : 'gray',
                            }}
                        >
                            ★
                        </span>
                    ))}
                    
                    <p className='text-green-600'>Average Rating: {averageRating.toFixed(2)} star{averageRating !== 1 ? 's' : ''}</p>
                    <p className='text-green-600'>Total Users: {totalUsers}</p>
                </div>

                
                    <textarea
                        placeholder="Write a review..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full h-24 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    



                 
            <button
                type="submit"
                className="bg-gray-900 text-white rounded-lg py-2 px-6 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Submit
            </button>

            <p className="text-2xl font-bold mt-6">Customer Ratings</p>

                
                <div className="mt-4 space-y-4">
                    {reviews.map((review, index) => (
                        <Reviewcard key={index} review={review} />
                    ))}
                </div>
            </form>
        </>
    );
};


export function calculateAverageRating(starCounts, totalUsers) {
    if (totalUsers === 0) return 0; 

    let weightedSum = 0;

    for (let star = 1; star <= 5; star++) {
        weightedSum += star * starCounts[star];
    }

    return weightedSum / totalUsers;
}

const productLoader = async ({ params }) => {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        return data;
    }


const getUserEmail = () => {
    const authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("Authtoken"))
        ?.split("=")[1];
    console.log("document.cookie value", authToken);

    const decoded = jwtDecode(authToken);
    console.log("decoded", decoded);
    const userEmail = decoded.userEmail;
    console.log("useremail", userEmail);
    return userEmail;
};

export { Addreviewpage as default, getUserEmail,productLoader };


