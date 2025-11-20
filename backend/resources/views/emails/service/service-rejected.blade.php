<!DOCTYPE html>
<html>
<head>
    <title>Service Status Update</title>
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
            /* Red gradient for rejection/alert */
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
            /* Red highlight color */
            color: #E74C3C;
            font-weight: 700;
        }
        
        .cta-container {
            text-align: center;
            margin: 35px 0;
        }
        
        .cta-button {
            display: inline-block;
            /* Red button color */
            background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%);
            color: #FFFFFF !important;
            text-decoration: none;
            padding: 16px 40px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 16px;
            box-shadow: 0 8px 20px rgba(231, 76, 60, 0.3);
            transition: transform 0.3s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(231, 76, 60, 0.4);
        }
        
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
            <div class="header-icon">⚠️</div> 
            <h1 class="header-title">Service Not Approved</h1>
        </div>
        
        <!-- Body -->
        <div class="email-body">
            {{-- Use the $provider variable for the greeting --}}
            <div class="greeting">Hello {{ $provider->name }},</div>
            
            <p class="message">
                Thank you for submitting your service, <span class="highlight">"{{ $service->title }}"</span>, for review under the **{{ $category->name }}** category.
            </p>
            
            <p class="message">
                After a thorough review by our admin team, we regret to inform you that your service has **not been approved** at this time.
            </p>

            <!-- Features Box with next steps/suggestions -->
            <div class="features-box">
                <div class="features-title">Next Steps for Resubmission</div>
                <ul class="features-list">
                    <li>Please review your service description, pricing, and required skills.</li>
                    <li>Ensure the service details are highly specific and competitive.</li>
                    <li>Make necessary refinements and resubmit your service for approval.</li>
                </ul>
            </div>
            
            <p class="message">
                We encourage you to make improvements and submit a revised version. We look forward to seeing your service live soon!
            </p>
            
            <!-- CTA Button -->
            <div class="cta-container">
                {{-- Assuming a route to edit the service --}}
                <a href="{{ config('app.url') }}/provider/service" class="cta-button">Edit Your Service</a>
            </div>
            
            
            <!-- Signature -->
            <div class="signature">
                <div class="signature-name">Best Regards,</div>
                <div class="signature-team">The {{ config('app.name') }} Team</div>
            </div>
        </div>
        
        <!-- Footer (No links, maintaining consistency with provider-rejected email) -->
        <div class="email-footer">
            <div class="footer-text">{{ config('app.name') }} - Your Platform Name</div>
            
            <div class="footer-text" style="margin-top: 20px; font-size: 12px; opacity: 0.7;">
                © {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
