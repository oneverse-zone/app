import React from 'react';
import {SplashScreen} from './SplashScreen';
import {Home} from './Home';
import {Login} from './Login';
import {RegisterOne} from './register/One';
import {RegisterTwo} from './register/Two';
import {ProfilePersist} from './profile/Persist';
import {Auth} from './Auth';

export const Route = {
  SplashScreen: 'SplashScreen',

  Home: 'Home',

  Login: 'Login',
  RegisterOne: 'RegisterOne',
  RegisterTwo: 'RegisterTwo',

  ProfilePersist: 'ProfilePersist',
  Auth: 'Auth',
};

export const routers: Array<{
  name: string;
  component: React.ComponentType;
}> = [
  {
    name: Route.SplashScreen,
    component: SplashScreen,
  },
  {
    name: Route.Home,
    component: Home,
  },
  {
    name: Route.Login,
    component: Login,
  },
  {
    name: Route.RegisterOne,
    component: RegisterOne,
  },
  {
    name: Route.RegisterTwo,
    component: RegisterTwo,
  },
  {
    name: Route.ProfilePersist,
    component: ProfilePersist,
  },
  {
    name: Route.Auth,
    component: Auth,
  },
];
