import React from "react";

const SecondForm = ({ formValues, onChange, option }) => {
  return (
    <div class="container mx-auto p4-10">
    <div class="max-w-md mx-auto bg-white rounded-lg overflow-hidden md:max-w-xl">
        <div class="md:flex">
            <div class="w-full px-6 py-8 md:p-8">
                <h2 class="text-2xl font-bold text-gray-800">Checkout</h2>
                <p class="mt-4 text-gray-600">Please fill out the form below to complete your purchase.</p>
                <form class="mt-6">
                    <div class="mb-6">
                        <label class="block text-gray-800 font-bold mb-2" for="name">
                            Name
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Name"/>
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-800 font-bold mb-2" for="email">
                            Email
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="abc@example.com"/>
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-800 font-bold mb-2" for="card_number">
                            Card Number
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="card_number" type="text" placeholder="**** **** **** 1234"/>
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-800 font-bold mb-2" for="expiration_date">
                            Expiration Date
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="expiration_date" type="text" placeholder="MM / YY"/>
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-800 font-bold mb-2" for="cvv">
                            CVV
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="cvv" type="text" placeholder="***"/>
                    </div>
                    {/*  */}
                    <input type="checkbox"/> <label htmlFor="">Securely save this card for my later purchase</label>
                    <div className="">
                      <h1 className="font-bold text-xl">Order details</h1>
                      <div className="flex justify-between items-center">
                      <p>Tắm , Vệ sinh</p>
                      <p>150.000đ</p>
                      </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
  );
};

export default SecondForm;
