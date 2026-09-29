```typeslang

@fn async function(@user string, @password string)
   #> @err1 UserNotFoundError
   #> @err1 IncorrectPasswordError
   => @ok {
      status: number = 200,
      message: string = "Logged in successfully",
      token: string
   }

```