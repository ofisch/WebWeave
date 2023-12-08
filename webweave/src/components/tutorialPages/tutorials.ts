const tutorials = {
  tutorial1: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Local Coffee Shop</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f2f2f2;
            }
    
            header {
                background-color: #964B00;
                color: white;
                padding: 1rem;
                text-align: center;
            }
    
            nav {
                display: flex;
                justify-content: center;
                background-color: #773300;
                padding: 0.5rem;
            }
    
            nav a {
                color: white;
                text-decoration: none;
                margin: 0 1rem;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                transition: background-color 0.3s;
                cursor: pointer; /* Set cursor to pointer to indicate hover effect */
            }
    
            nav a:hover {
                background-color: #964B00;
            }
    
            section {
                margin: 2rem;
                text-align: center;
            }
    
            section h2 {
                color: #964B00;
            }
    
            .menu-item {
                border: 1px solid #964B00;
                padding: 1rem;
                margin: 1rem;
                border-radius: 5px;
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
            }
    
            footer {
                background-color: #964B00;
                color: white;
                text-align: center;
                padding: 1rem;
            }
        </style>
        <script>
            // Prevent default action on click
            document.addEventListener('DOMContentLoaded', function () {
                const navLinks = document.querySelectorAll('nav a');
                navLinks.forEach(link => {
                    link.addEventListener('click', function (event) {
                        event.preventDefault();
                    });
                });
            });
        </script>
    </head>
    <body>
        <header>
            <h1>Welcome to Our Coffee Shop</h1>
        </header>
        <nav>
            <a href="#">Home</a>
            <a href="#">Menu</a>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
        </nav>
        <section>
            <h2>Our Menu</h2>
            <div class="menu-item">
                <h3>Espresso</h3>
                <p>Rich, bold and full-flavored</p>
            </div>
            <div class="menu-item">
                <h3>Cappuccino</h3>
                <p>Perfectly balanced and smooth</p>
            </div>
            <div class="menu-item">
                <h3>Latte</h3>
                <p>Creamy and satisfying</p>
            </div>
        </section>
        <footer>
            <p>&copy; 2023 Local Coffee Shop</p>
        </footer>
    </body>
    </html>
    <style>
    .input {
        border: 2px solid #e8e8e8;
        padding: 15px;
        border-radius: 10px;
        background-color: #2C3E50;
        font-size: 1rem;
        font-weight: bold;
        text-align: center;
        color: #e8e8e8;
    }
    
    .input:focus {
        outline-color: #00BFFF;
        background-color: #2C3E50;
        box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
    }
    </style>
    `,
  tutorial2: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Local Coffee Shop</title>
        <script>
            // Prevent default action on click
            document.addEventListener('DOMContentLoaded', function () {
                const navLinks = document.querySelectorAll('nav a');
                navLinks.forEach(link => {
                    link.addEventListener('click', function (event) {
                        event.preventDefault();
                    });
                });
            });
        </script>
        <style>
          
    
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f2f2f2;
            }
    
            header {
                background-image: url('https://t3.ftcdn.net/jpg/05/68/26/64/360_F_568266450_wwY8p50EyOHULpd68D0z0QvMyNOu7Xls.jpg');
                background-size: cover;
                color: white;
                padding: 8rem;
                text-align: center;
            }
    
            nav {
                display: flex;
                justify-content: center;
                background-color: #773300;
                padding: 0.5rem;
            }
    
            nav a {
                color: white;
                text-decoration: none;
                margin: 0 1rem;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                transition: background-color 0.3s;
            }
    
            nav a:hover {
                background-color: #964B00;
            }
    
            section {
                margin: 2rem;
                text-align: center;
            }
    
            section h2 {
                color: #964B00;
            }
    
            .menu-item {
                border: 1px solid #964B00;
                padding: 1rem;
                margin: 1rem;
                border-radius: 5px;
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
            }
    
            footer {
                background-color: #964B00;
                color: white;
                text-align: center;
                padding: 1rem;
            }
    
            .input {
                border: 2px solid #e8e8e8;
                padding: 15px;
                border-radius: 10px;
                background-color: #2C3E50;
                font-size: 1rem;
                font-weight: bold;
                text-align: center;
                color: #e8e8e8;
            }
    
            .input:focus {
                outline-color: #00BFFF;
                background-color: #2C3E50;
                box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
            }
        </style>
        <script>
        // Prevent default action on click
        document.addEventListener('DOMContentLoaded', function () {
            const navLinks = document.querySelectorAll('nav a');
            navLinks.forEach(link => {
                link.addEventListener('click', function (event) {
                    event.preventDefault();
                });
            });
        });
    </script>
    </head>
    <body>
        <header>
            <h1>Welcome to Our Coffee Shop</h1>
        </header>
        <nav>
            <a href="#">Home</a>
            <a href="#">Menu</a>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
        </nav>
        <section>
            <h2>Our Menu</h2>
            <div class="menu-item">
                <h3>Espresso</h3>
                <p>Rich, bold and full-flavored</p>
            </div>
            <div class="menu-item">
                <h3>Cappuccino</h3>
                <p>Perfectly balanced and smooth</p>
            </div>
            <div class="menu-item">
                <h3>Latte</h3>
                <p>Creamy and satisfying</p>
            </div>
        </section>
        <footer>
            <p>&copy; 2023 Local Coffee Shop</p>
        </footer>
    </body>
    </html>`,

  tutorial3: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Local Coffee Shop</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f2f2f2;
            }
    
            header {
                background-image: url('https://t3.ftcdn.net/jpg/05/68/26/64/360_F_568266450_wwY8p50EyOHULpd68D0z0QvMyNOu7Xls.jpg');
                background-size: cover;
                color: white;
                padding: 8rem;
                text-align: center;
            }
    
            nav {
                display: flex;
                justify-content: center;
                background-color: #773300;
                padding: 0.5rem;
            }
    
            nav a {
                color: white;
                text-decoration: none;
                margin: 0 1rem;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                transition: background-color 0.3s;
            }
    
            nav a:hover {
                background-color: #964B00;
            }
    
            section {
                margin: 2rem;
                text-align: center;
            }
    
            section h2 {
                color: #964B00;
            }
    
            .menu-item {
                border: 1px solid #964B00;
                padding: 1rem;
                margin: 1rem;
                border-radius: 5px;
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
            }
    
            footer {
                background-color: #964B00;
                color: white;
                text-align: center;
                padding: 1rem;
            }
    
            .input {
                border: 2px solid #e8e8e8;
                padding: 15px;
                border-radius: 10px;
                background-color: #2C3E50;
                font-size: 1rem;
                font-weight: bold;
                text-align: center;
                color: #e8e8e8;
            }
    
            .input:focus {
                outline-color: #00BFFF;
                background-color: #2C3E50;
                box-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
            }
        </style>
        <script>
        // Prevent default action on click
        document.addEventListener('DOMContentLoaded', function () {
            const navLinks = document.querySelectorAll('nav a');
            navLinks.forEach(link => {
                link.addEventListener('click', function (event) {
                    event.preventDefault();
                });
            });
        });
    </script>
    </head>
    <body>
        <header>
            <h1>Welcome to Our Coffee Shop</h1>
        </header>
        <nav>
            <a href="#">Home</a>
            <a href="#">Menu</a>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
        </nav>
        <section>
            <h2>Our Menu</h2>
            <div class="menu-item">
                <h3>Espresso</h3>
                <p>Rich, bold and full-flavored</p>
            </div>
            <div class="menu-item">
                <h3>Cappuccino</h3>
                <p>Perfectly balanced and smooth</p>
            </div>
            <div class="menu-item">
                <h3>Latte</h3>
                <p>Creamy and satisfying</p>
            </div>
        </section>
        <section>
            <h2>About Us</h2>
            <p>Welcome to our cozy neighborhood coffee shop! We are dedicated to providing our community with high quality coffee and a warm, inviting atmosphere. Our beans are locally sourced and roasted to perfection, creating delicious and aromatic coffee creations. Whether you're looking for a quick morning pick-me-up or a relaxing place to meet with friends, our small coffee shop is the perfect place to savor your favorite brew. Come in and enjoy the friendly service and delightful ambiance at our local coffee shop.</p>
        </section>
        <footer>
            <p>&copy; 2023 Local Coffee Shop</p>
        </footer>
    </body>
    </html>`,

  tutorial4: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Local Coffee Shop</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f8f8f8;
                color: #333;
            }
    
            header {
                background-image: url('https://t3.ftcdn.net/jpg/05/68/26/64/360_F_568266450_wwY8p50EyOHULpd68D0z0QvMyNOu7Xls.jpg');
                background-size: cover;
                color: #fff;
                padding: 4rem;
                text-align: center;
            }
    
            nav {
                display: flex;
                justify-content: center;
                background-color: #ff7f50;
                padding: 1rem;
            }
    
            nav a {
                color: #fff;
                text-decoration: none;
                margin: 0 1rem;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                transition: background-color 0.3s;
            }
    
            nav a:hover {
                background-color: #ff6347;
            }
    
            section {
                margin: 2rem;
                text-align: center;
            }
    
            section h2 {
                color: #ff6347;
            }
    
            .menu-item {
                border: 1px solid #ff6347;
                padding: 1.5rem;
                margin: 1rem;
                border-radius: 5px;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                background-color: #fff;
            }
    
            footer {
                background-color: #ff6347;
                color: #fff;
                text-align: center;
                padding: 1rem;
            }
    
            .input {
                border: 2px solid #ccc;
                padding: 15px;
                border-radius: 10px;
                background-color: #e0e0e0;
                font-size: 1rem;
                font-weight: bold;
                text-align: center;
                color: #333;
            }
    
            .input:focus {
                outline-color: #ff6347;
                background-color: #e0e0e0;
                box-shadow: 0 0 10px rgba(255, 99, 71, 0.5);
            }
        </style>
        <script>
        // Prevent default action on click
        document.addEventListener('DOMContentLoaded', function () {
            const navLinks = document.querySelectorAll('nav a');
            navLinks.forEach(link => {
                link.addEventListener('click', function (event) {
                    event.preventDefault();
                });
            });
        });
    </script>
    </head>
    <body>
        <header>
            <h1>Welcome to Our Coffee Shop</h1>
        </header>
        <nav>
            <a href="#">Home</a>
            <a href="#">Menu</a>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
        </nav>
        <section>
            <h2>Our Menu</h2>
            <div class="menu-item">
                <h3>Espresso</h3>
                <p>Rich, bold and full-flavored</p>
            </div>
            <div class="menu-item">
                <h3>Cappuccino</h3>
                <p>Perfectly balanced and smooth</p>
            </div>
            <div class="menu-item">
                <h3>Latte</h3>
                <p>Creamy and satisfying</p>
            </div>
        </section>
        <section>
            <h2>About Us</h2>
            <p>Welcome to our cozy neighborhood coffee shop! We are dedicated to providing our community with high-quality coffee and a warm, inviting atmosphere. Our beans are locally sourced and roasted to perfection, creating delicious and aromatic coffee creations. Whether you're looking for a quick morning pick-me-up or a relaxing place to meet with friends, our small coffee shop is the perfect place to savor your favorite brew. Come in and enjoy the friendly service and delightful ambiance at our local coffee shop.</p>
        </section>
        <footer>
            <p>&copy; 2023 Local Coffee Shop</p>
        </footer>
    </body>
    </html>`,
};

export { tutorials };
