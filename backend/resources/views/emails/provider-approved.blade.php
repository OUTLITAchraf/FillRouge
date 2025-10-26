<!DOCTYPE html>
<html>
<head>
    <title>Provider Approved</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #ECF0F1;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #FFFFFF;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        
        .email-header {
            background: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%);
            padding: 40px 30px;
            text-align: center;
            color: #FFFFFF;
        }
        
        .logo {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 10px;
        }
        
        .header-icon {
            font-size: 60px;
            margin-bottom: 20px;
        }
        
        .header-title {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
        }
        
        .email-body {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 20px;
            font-weight: 700;
            color: #2C3E50;
            margin-bottom: 20px;
        }
        
        .message {
            font-size: 16px;
            color: #2C3E50;
            margin-bottom: 15px;
        }
        
        .highlight {
            color: #2ECC71;
            font-weight: 700;
        }
        
        .cta-container {
            text-align: center;
            margin: 35px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #2ECC71 0%, #27AE60 100%);
            color: #FFFFFF;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 16px;
            box-shadow: 0 8px 20px rgba(46, 204, 113, 0.3);
            transition: transform 0.3s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(46, 204, 113, 0.4);
        }
        
        .features-box {
            background: rgba(46, 204, 113, 0.05);
            border-left: 4px solid #2ECC71;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        
        .features-title {
            font-size: 18px;
            font-weight: 700;
            color: #2C3E50;
            margin-bottom: 15px;
        }
        
        .features-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .features-list li {
            padding: 8px 0;
            color: #2C3E50;
            font-size: 15px;
        }
        
        .features-list li:before {
            content: "✓ ";
            color: #2ECC71;
            font-weight: 700;
            margin-right: 8px;
        }
        
        .email-footer {
            background-color: #2C3E50;
            padding: 30px;
            text-align: center;
            color: #FFFFFF;
        }
        
        .footer-text {
            margin: 5px 0;
            font-size: 14px;
            opacity: 0.9;
        }
        
        .footer-links {
            margin-top: 20px;
        }
        
        .footer-links a {
            color: #2ECC71;
            text-decoration: none;
            margin: 0 10px;
            font-size: 14px;
            font-weight: 600;
        }
        
        .signature {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ECF0F1;
        }
        
        .signature-name {
            font-weight: 700;
            color: #2C3E50;
            margin-bottom: 5px;
        }
        
        .signature-team {
            color: #7F8C8D;
            font-size: 14px;
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .email-header {
                padding: 30px 20px;
            }
            
            .email-body {
                padding: 30px 20px;
            }
            
            .header-title {
                font-size: 24px;
            }
            
            .cta-button {
                padding: 14px 30px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <div class="header-icon">🎉</div>
            <h1 class="header-title">Account Approved!</h1>
        </div>
        
        <!-- Body -->
        <div class="email-body">
            <div class="greeting">Hello {{ $user->name }},</div>
            
            <p class="message">
                Great news! Your provider account has been <span class="highlight">approved</span> and you're now ready to start offering your services on Fidarek.
            </p>
            
            <p class="message">
                You can now access your provider dashboard and begin creating your first service listing to connect with customers across Morocco.
            </p>
            
            <!-- CTA Button -->
            <div class="cta-container">
                <a href="{{ config('app.url') }}/login" class="cta-button">Login to Your Dashboard</a>
            </div>
            
            <!-- Features Box -->
            <div class="features-box">
                <div class="features-title">What's Next?</div>
                <ul class="features-list">
                    <li>Create your first service listing</li>
                    <li>Set your pricing and availability</li>
                    <li>Start receiving booking requests</li>
                    <li>Build your reputation with customer reviews</li>
                </ul>
            </div>
            
            <p class="message">
                If you have any questions or need assistance getting started, our support team is here to help!
            </p>
            
            <!-- Signature -->
            <div class="signature">
                <div class="signature-name">Thank you for joining us!</div>
                <div class="signature-team">The {{ config('app.name') }} Team</div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
            <div class="footer-text">{{ config('app.name') }} - Morocco's Leading Service Platform</div>
            <div class="footer-links">
                <a href="{{ config('app.url') }}">Website</a> |
                <a href="{{ config('app.url') }}/help">Help Center</a> |
                <a href="{{ config('app.url') }}/contact">Contact Us</a>
            </div>
            <div class="footer-text" style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>