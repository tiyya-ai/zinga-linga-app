$content = Get-Content "src\components\UserDashboard.tsx" -Raw

# Replace the import
$content = $content -replace "import { Checkout } from './Checkout';", "import { CompactCheckout } from './CompactCheckout';"

# Replace the component usage
$content = $content -replace "<Checkout", "<CompactCheckout"
$content = $content -replace "onPaymentComplete=\{handlePaymentComplete\}", "onSuccess={handlePaymentComplete}"
$content = $content -replace "onBackToCart=\{handleBackToCart\}\s*user=\{user\}", "user={user}"

Set-Content "src\components\UserDashboard.tsx" -Value $content