function calculator(operator)
{
    const num1 = parseFloat(document.getElementById("num1").value);
    const num2 = parseFloat(document.getElementById("num2").value);
    const result = document.getElementById("result");
    if (isNaN(num1) || isNaN(num2))
    {
        result.textContent = "Please enter valid numbers";
        return;
    }
    let answer;
    switch (operator)
    {
        case "+":
            answer = num1 + num2;
            break;
        case "-":
            answer = num1 - num2;
            break;
        case "*":
            answer = num1 * num2;
            break;
        case "/":
            if (num2 === 0)
            {
                result.textContent = "Cannot divide by zero";
                return;
            }
            answer = num1 / num2;
            break;
    }
    result.textContent = "Result: " + answer;
}