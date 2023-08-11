/* esline-disable */
import axios from "axios";
import { showAlert } from "./alerts";

const publicKey =
  "pk_test_51LSyEASJVoayc4z8GuaUsCbWnZ0ACvSgXrZb3qVpxkLw8lQjPPXdZgc4sLtiCRrDY8qml3bKHcygFeD3vMLVQMhh0040CRDoH6";

const stripe = Stripe(publicKey);

export const bookTour = async (tourId) => {
  try {
    // 1. Get checkout session from API
    const res = await axios.get(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2. Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: res.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert("error", error);
  }
};
