import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
// import jwtdecode from 'jwt-decode'
import { crudAppsContext } from '../../App'

const PizzaCreate = (props) => {
    const { AxiosURL, darkMode } = useContext(crudAppsContext)
    const { order, setOrder } = props

    const navigate = useNavigate()
    const [pizza, setPizza] = useState({
        orderType: "Delivery",
        size: "Large",
        crust: "Thin crust",
        qty: 1,
        toppings: {
            "Pepperoni": false,
            "Extra Cheese": false,
            "Sausage": false,
            "Anchovies": false,
            "Green Olives": false,
            "Black Olives": false,
            "Mushrooms": false,
            "Broccoli": false,
            "Buffalo Chicken": false,
            "Chicken Bacon Ranch": false,
            "Teriyaki Chicken": false,
            "Ham Pineapple": false
        }
    })

    // const addToOrder = (e) => {
    //     e.preventDefault()
    //     setOrder([...order, pizza])
    //     console.log("order", order)
    // }

    useEffect(() => {
        if (Cookies.get('order') === undefined) Cookies.set('order', JSON.stringify([order]), { expires: 7 })
        // eslint-disable-next-line
    }, [])

    const checkout = (e) => {
        e.preventDefault()
        axios.post(`${AxiosURL}/pizzas`, pizza, { withCredentials: true })
            .then(res => {
                console.log(JSON.stringify([...order, res.data.pizza]))
                setOrder([...order, res.data.pizza])
                Cookies.set('order', JSON.stringify([...order, res.data.pizza]), { expires: 7 })

                // const orderData = [...order, pizza]
                // navigate("/pizzaTime/checkout")
            })
            .catch(err => {
                console.log(`submit errer`, err)
                // setErrors({
                //     idea: err.response.data.error.errors.idea,
                // })
                // console.log(errors)
            })
    }

    const handleToppingChange = (topping) => {
        setPizza((prevPizza) => ({
            ...prevPizza,
            toppings: {
                ...prevPizza.toppings,
                [topping]: !prevPizza.toppings[topping],
            },
        }))
    }


    return (
        <div className='mt-5'>
            <h1 style={{ marginTop: "75px" }}>Create your Pizza!</h1>
            <form className='col-6 mx-auto'>
                <label>Order Type:</label>
                <select className="form-select" value={pizza.orderType} onChange={(e) => setPizza({ ...pizza, orderType: e.target.value })}>
                    <option value="Delivery">Delivery</option>
                    <option value="Take Out">Take Out</option>
                    <option value="Dine In">Dine In</option>
                </select>
                <div className="row">
                    <div className="col-4">
                        <label>Size:</label>
                        <select className="form-select col-4" value={pizza.size} onChange={(e) => setPizza({ ...pizza, size: e.target.value })}>
                            <option value="Large">Large 18"</option>
                            <option value="Medium">Medium 14"</option>
                            <option value="Small">Small 10"</option>
                        </select>
                    </div>
                    <div className="col-6">
                        <label>Crust:</label>
                        <select className="form-select col-4" value={pizza.crust} onChange={(e) => setPizza({ ...pizza, crust: e.target.value })}>
                            <option value="Thin crust">Thin crust</option>
                            <option value="Regular crust">Regular crust</option>
                            <option value="Cheese-filled crust">Cheese filled crust</option>
                            <option value="Cauliflower crust">Cauliflower crust</option>
                        </select>
                    </div>
                    <div className="col-2">
                        <label>QTY:</label>
                        <select className="form-select col-4" value={pizza.qty} onChange={(e) => setPizza({ ...pizza, qty: e.target.value })}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div>
                        <label>
                            Toppings:
                        </label>
                        <br />
                        <div className="toppings-grid">
                            {Object.keys(pizza.toppings).map((topping) => (
                                <label key={topping}>
                                    <input
                                        type="checkbox"
                                        checked={pizza.toppings[topping]}
                                        onChange={() => handleToppingChange(topping)}
                                    />
                                    &nbsp;{topping.toString()}&nbsp;&nbsp;
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <button className={darkMode ? "btn btn-outline-light" : "btn btn-outline-dark"} onClick={checkout}>Add To Order</button>&nbsp;
                <button className={darkMode ? "btn btn-outline-dark" : "btn btn-outline-light"} onClick={() => navigate("/pizzaTime/cart")}>Go To Cart</button>
            </form>
        </div>
    )
}

export default PizzaCreate