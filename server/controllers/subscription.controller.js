import User from '../models/user.model'
import Subscription from '../models/subscription.model'
import _ from 'lodash'
import errorHandler from '../helpers/dbErrorHandler'
import formidable from 'formidable';
import fs from 'fs';
import stripe from 'stripe';
import UTILS from '../helpers/format-numbers'


const myStripe = stripe('sk_test_PwsYlYVaGdzKF04GmfzbMQcB00yNVUnDBz')


const createCustomer = (req, res) => {


    /*
    * step 1: find User
    * step 2: find subscription if user exist,
    * step 3 a: if subscription does not exist, => create stripe user and adding payment method
    * step 4: add stripe user is to data base
    * step 3 b: if subscription exist => attach credit card to user
    * 
    */


    let { id, user } = req.body;


    User.findById(user).exec((err, _user) => {
        if (err || !_user) {
            return res.status('400').json({
                error: "User not found"
            })
        } else {

            Subscription.find({ user_id: user })
                .exec((err, sub) => {
                    if (err) {
                        return res.status(400).json({
                            error: "Subscription not found"
                        });
                    }

                    let count = sub.length
                    if (count == 0) {
                        try {
                            myStripe.customers.create({
                                payment_method: id,
                                email: _user.email
                            }).then(customer => {
                                let _subscription = new Subscription({ user_id: user, customer_id: customer.id, created_date: Date.now(), status: false });
                                _subscription.save(function (err, _subs) {
                                    if (err) {
                                        return res.status(400).json({
                                            error: err
                                        });
                                    } else {
                                        sub = _subs
                                        res.json(_subs)
                                    }
                                })
                            })
                        } catch (error) {
                            console.log("stripe-routes.js 17 | error", error);
                            res.json({
                                message: "Stripe Server Error",
                                success: false,
                            });
                        }

                    } else {

                        //let subscription_id = sub[0].subscription_id;
                        let customer_id = sub[0].customer_id;

                        try {
                            myStripe.paymentMethods.attach(
                                id,
                                { customer: customer_id }
                            ).then(customer => {
                                myStripe.customers.update(
                                    customer_id,
                                    { invoice_settings: { default_payment_method: id } }
                                ).then(subscription => {
                                    res.json("Credit Card Updated")
                                })
                            })

                        } catch (error) {
                            console.log("stripe-routes.js 17 | error", error);
                            res.json({
                                message: "Stripe Server Error",
                                success: false,
                            });
                        }
                    }
                });
        }
    })
}

const createAndChangeSubscription = (req, res) => {

    /*
    * step 1: find User
    * step 2: find subscription if user exist,
    * step 3 a: if subscription does not exist, => create stripe user and user subscription
    * step 4: add stripe user(id) and user subsscript(id) is to data base
    * step 3 b: if stripe user exist => check if subscription is created or not
    * step 5: if subscription is not available => create
    * step 6: if subscription us available => change
    * 
    */


    let { user, plan_id } = req.body;


    User.findById(user).exec((err, _user) => {
        if (err || !_user) {
            return res.status('400').json({
                error: "User not found"
            })
        } else {

            Subscription.find({ user_id: user })
                .exec((err, sub) => {
                    if (err) {
                        return res.status(400).json({
                            error: "Subscription not found"
                        });
                    }

                    let count = sub.length
                    if (count == 0) {
                        try {
                            myStripe.customers.create({
                                email: _user.email
                            }).then(customer => {
                                let _subscription = new Subscription({ user_id: user, customer_id: customer.id, created_date: Date.now(), status: false });
                                _subscription.save(function (err, _subs) {
                                    if (err) {
                                        return res.status(400).json({
                                            error: err
                                        });
                                    } else {
                                        sub = _subs

                                        //subscription
                                        myStripe.subscriptions.create({
                                            customer: customer.id,
                                            items: [
                                                {
                                                    price: plan_id
                                                }
                                            ]
                                        }).then(subscription => {
                                            Subscription.findByIdAndUpdate(sub._id, { $set: { subscription_id: subscription.id, status: true } }, { new: true })
                                                .exec((err, result) => {
                                                    if (err) {
                                                        return res.status(400).json({
                                                            error: errorHandler.getErrorMessage(err)
                                                        })
                                                    } else {
                                                        res.json(result)
                                                    }
                                                })
                                        });
                                        //subscription
                                    }
                                })
                            })
                        } catch (error) {
                            console.log("stripe-routes.js 17 | error", error);
                            res.json({
                                message: "Stripe Server Error",
                                success: false,
                            });
                        }

                    } else {

                        let subscription_id = sub[0].subscription_id;
                        let customer_id = sub[0].customer_id;

                        try {

                            if (subscription_id == undefined || subscription_id == '') {
                                myStripe.subscriptions.create({
                                    customer: customer_id,
                                    items: [
                                        {
                                            price: plan_id
                                        }
                                    ]
                                }).then(subscription => {
                                    Subscription.findByIdAndUpdate(sub[0]._id, { $set: { subscription_id: subscription.id, status: true } }, { new: true })
                                        .exec((err, result) => {
                                            if (err) {
                                                return res.status(400).json({
                                                    error: errorHandler.getErrorMessage(err)
                                                })
                                            } else {
                                                res.json(result)
                                            }
                                        })
                                });
                            } else {

                                myStripe.subscriptions.retrieve(subscription_id).then(subscribe => {
                                    myStripe.subscriptions.update(subscription_id, {
                                        cancel_at_period_end: false,
                                        proration_behavior: 'create_prorations',
                                        items: [
                                            {
                                                id: subscribe.items.data[0].id,
                                                price: plan_id
                                            }
                                        ]
                                    }).then(subscription => {
                                        Subscription.findByIdAndUpdate(sub[0]._id, { $set: { subscription_id: subscription.id, status: true } }, { new: true })
                                            .exec((err, result) => {
                                                //console.log(subscription)
                                                if (err) {
                                                    console.log(err)
                                                    return res.status(400).json({
                                                        error: errorHandler.getErrorMessage(err)
                                                    })
                                                }
                                                res.json(result)
                                            })
                                    });
                                })

                            }

                        } catch (error) {
                            console.log("stripe-routes.js 17 | error", error);
                            res.json({
                                message: "Stripe Server Error",
                                success: false,
                            });
                        }
                    }
                });
        }
    })
}

const deleteSubscription = (req, res) => {

    let { user } = req.body


    Subscription.find({ user_id: user })
        .exec((err, sub) => {
            if (err) {
                return res.status(400).json({
                    error: "Subscription not found"
                });
            }

            let count = sub.length
            if (count == 0) {
                res.json('No Active subscrption')
            } else {
                try {
                    myStripe.subscriptions.del(
                        sub[0].subscription_id
                    ).then(plan => {

                        Subscription.findByIdAndUpdate(sub[0].subscription_id, { $push: { subscription_id: '' } }, { new: true })
                            .exec((err, result) => {
                                if (err) {
                                    return res.status(400).json({
                                        error: errorHandler.getErrorMessage(err)
                                    })
                                } else {
                                    res.json(result)
                                }
                            })
                    });
                } catch (error) {
                    console.log("stripe-routes.js 17 | error", error);
                    res.json({
                        message: "Stripe Server Error",
                        success: false,
                    });
                }
            }
        });



}

const retrievePayment = (req, res) => {
    let { user } = req.body
    Subscription.find({ user_id: user })
        .exec((err, sub) => {
            if (err) {
                return res.status(400).json({
                    error: "Subscription not found"
                });
            }

            let count = sub.length
            if (count == 0) {
                res.json('No payment method')
            } else {
                try {
                    myStripe.paymentMethods.list({
                        customer: sub[0].customer_id,
                        type: 'card',
                    }).then(customer => {
                        res.json(customer)
                    });
                } catch (error) {
                    console.log("stripe-routes.js 17 | error", error);
                    res.json({
                        message: "Stripe Server Error",
                        success: false,
                    });
                }
            }
        });
}

const retrieveCustomer = (req, res) => {


    let { user } = req.body
    Subscription.find({ user_id: user })
        .exec((err, sub) => {
            if (err) {
                return res.status(400).json({
                    error: "Subscription not found"
                });
            }

            let count = sub.length
            if (count == 0) {
                res.json('No Subscription')
            } else {
                try {
                    myStripe.customers.retrieve(sub[0].customer_id).then(customer => {
                        res.json(customer)
                    });
                } catch (error) {
                    console.log("stripe-routes.js 17 | error", error);
                    res.json({
                        message: "Stripe Server Error",
                        success: false,
                    });
                }
            }
        });




}




const listProductAndPlan = (req, res) => {

    try {
        Promise.all(
            [
                myStripe.products.list({}),
                myStripe.plans.list({})
            ]
        ).then(stripeData => {


            var products = stripeData[0].data;
            var plans = stripeData[1].data;

            //console.log(plans)

            plans = plans.sort((a, b) => {
                /* Sort plans in ascending order of price (amount)
                 * Ref: https://www.w3schools.com/js/js_array_sort.asp */
                return a.amount - b.amount;
            }).map(plan => {
                /* Format plan price (amount) */
                var amount = UTILS.formatUSD(plan.amount)

                return { ...plan, amount };
            });

            products.forEach(product => {
                const filteredPlans = plans.filter(plan => {
                    return plan.product === product.id;
                });

                product.plans = filteredPlans;
            });

            res.json(products)
        });
    } catch (error) {
        console.log("stripe-routes.js 17 | error", error);
        res.json({
            message: "Stripe Server Error",
            success: false,
        });
    }
}

const listPlan = (req, res) => {

    try {
        myStripe.plans.list({ limit: 3 }).then(plan => {
            res.json(plan)
        });
    } catch (error) {
        console.log("stripe-routes.js 17 | error", error);
        res.json({
            message: "Stripe Server Error",
            success: false,
        });
    }

}

const listProduct = (req, res) => {

    try {
        myStripe.products.list({ limit: 3 }).then(product => {
            res.json(product)
        });
    } catch (error) {
        console.log("stripe-routes.js 17 | error", error);
        res.json({
            message: "Stripe Server Error",
            success: false,
        });
    }

}

const retrieveSubscription = (req, res) => {
    try {

        let { user } = req.body
        Subscription.find({ user_id: user })
            .exec((err, sub) => {
                if (err) {
                    return res.status(400).json({
                        error: "Subscription not found"
                    });
                }

                let count = sub.length
                if (count == 0 || sub[0].subscription_id == undefined || sub[0].subscription_id == '') {
                    res.json('No Subscription')
                } else {
                    try {
                        myStripe.subscriptions.retrieve(sub[0].subscription_id).then(customer => {
                            res.json(customer)
                        });
                    } catch (error) {
                        console.log("stripe-routes.js 17 | error", error);
                        res.json({
                            message: "Stripe Server Error",
                            success: false,
                        });
                    }
                }
            });

    } catch (error) {
        console.log("stripe-routes.js 17 | error", error);
        res.json({
            message: "Stripe Server Error",
            success: false,
        });
    }
}




/*const createPlan = (req, res) => {
    myStripe.plans.create({
        nickname: req.planName,
        amount: UTILS.formatStripeAmount(req.planAmount),
        interval: req.planInterval,
        interval_count: parseInt(req.planIntervalNumber),
        product: req.productId,
        currency: 'USD'
    });
}*/

/*const changeSubscription = (req, res) => {
    try {
        myStripe.subscriptions.retrieve(req.body.subscriptions_id);
        myStripe.subscriptions.update(req.body.subscriptions_id, {
            cancel_at_period_end: false,
            proration_behavior: 'create_prorations',
            items: [{
                id: subscription.items.data[0].id,
                price: req.body.planId,
            }]
        }).then(subscription => {
            res.json(subscription)
        });
    } catch (error) {
        console.log("stripe-routes.js 17 | error", error);
        res.json({
            message: "Stripe Server Error",
            success: false,
        });
    }
}*/


export default {
    createCustomer,
    createAndChangeSubscription,
    deleteSubscription,
    retrievePayment,
    retrieveCustomer,
    retrieveSubscription,

    listProductAndPlan,
    listPlan,
    listProduct,
}