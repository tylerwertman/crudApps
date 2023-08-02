import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { crudAppsContext } from '../../App'


const PizzaTime = () => {
    const { darkMode } = useContext(crudAppsContext)
    const navigate = useNavigate()

    return (
        <div className='mt-5'>
            <h1 style={{ marginTop: "75px" }}>Welcome to Pizza Time</h1>
            <div className={darkMode ? "mainDivDark" : "mainDivLight"}>
                <h3>Quick Options</h3>
                <div className={"col-sm-8 mx-auto flex"}>
                    <div className="pizzaBox col">
                        <p>Custom order your pie today! Made from the best stuff on Earth-510!</p>
                        <button className='btn btn-info' onClick={() => { navigate('/pizzaTime/create') }}>New Order</button>
                    </div>
                    <div className="pizzaBox col">
                        <p>The usual. Perfect option for our favorite customer!</p>
                        <button className='btn btn-success'>Re-Order Fav</button>
                    </div>
                    <div className="pizzaBox col">
                        <p>Please no anchovies, please no anchovies!</p>
                        <button className='btn btn-warning'>Surprise Me!</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PizzaTime