<!DOCTYPE html>
<html>
<head>
    <title>Account Status Update</title>
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
            /* Changed to a red gradient for rejection/alert */
            background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%);
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
            /* Changed highlight color to red */
            color: #E74C3C;
            font-weight: 700;
        }
        
        /* Styles for features-box are left in case you want to add a "Reasons" box later */
        .features-box {
            background: rgba(231, 76, 60, 0.05); /* Red-tinted background */
            border-left: 4px solid #E74C3C; /* Red border */
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
            /* Changed icon to a cross */
            content: "✗ ";
            color: #E74C3C;
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
        
        /* Footer links styles are kept, but HTML is removed as requested */
        .footer-links a {
            color: #E74C3C; /* Matched to new theme */
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
            
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <!-- Changed Icon -->
            <div class="header-icon">ℹ️</div> 
            <!-- Changed Title -->
            <h1 class="header-title">Account Status Update</h1>
        </div>
        
        <!-- Body -->
        <div class="email-body">
            {{-- Use the $provider variable passed from ProviderRejectedMail --}}
            <div class="greeting">Hello {{ $provider->name }},</div>
            
            <p class="message">
                We are writing to inform you about an update regarding your provider account application on {{ config('app.name') }}.
            </p>
            
            <p class="message">
                After a careful review, we regret to inform you that your application has <span class="highlight">not been approved</span> at this time.
            </p>

            
            <p class="message">
                **This decision is based on the assessment of your resume and skills.** At this time, your profile does not meet the minimum experience and skill requirements needed to offer services on our platform.
            </p>
            
            <p class="message">
                If you wish to get more detailed feedback on your application or discuss future opportunities, please feel free to contact our support team.
            </p>
            
            <!-- Signature -->
            <div class="signature">
                <div class="signature-name">We wish you the best,</div>
                <div class="signature-team">The {{ config('app.name') }} Team</div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="email-footer">
            <div class="footer-text">{{ config('app.name') }} - Your Platform Name</div>
                    
            <div class="footer-text" style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
