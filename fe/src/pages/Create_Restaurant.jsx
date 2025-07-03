import RestaurantForm from "../components/RestaurantForm"

const Create_Restaurant = () => {
    return(
        <RestaurantForm title = "" location = "" description = "" target="/restaurants" Heading="Add new restaurant" newForm = {true}/>
    )
}

export default Create_Restaurant