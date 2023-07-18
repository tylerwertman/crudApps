import React from 'react'
import Cookies from 'js-cookie'
// import jwtdecode from 'jwt-decode'
import { Link } from 'react-router-dom'

const PizzaCart = () => {
    const order = Cookies.get('order')
    console.log(order)

    return (
        <div className='mt-5'>
            <h1 style={{ marginTop: "75px" }}>Cart</h1><h4><Link to="/pizzaTime/create">Create</Link></h4>
            <div>
                <div className='orderDetails'>
                    {order.map((pizza, index) => {
                        return (
                            <div key={pizza._id}>
                                {pizza}
                            </div>
                        )
                    })}
                </div>
                <div className='payment'>

                </div>
            </div>
        </div>
    )
}

export default PizzaCart