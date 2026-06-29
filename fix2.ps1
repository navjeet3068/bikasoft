$f = 'e:\Work\Bikasoft\index.html'
$c = Get-Content $f -Raw
$crlf = [char]13 + [char]10

# FIX 2: Add context66 mobile styles (header + box padding)
$old = '      .context66-box p {' + $crlf + '        color: var(--muted);' + $crlf + '        font-size: 14px;' + $crlf + '        line-height: 1.6;' + $crlf + '        margin: 0;' + $crlf + '        flex-grow: 1;' + $crlf + '      }' + $crlf + '    </style>'
$new = '      .context66-box p {' + $crlf + '        color: var(--muted);' + $crlf + '        font-size: 14px;' + $crlf + '        line-height: 1.6;' + $crlf + '        margin: 0;' + $crlf + '        flex-grow: 1;' + $crlf + '      }' + $crlf + $crlf + '      @media (max-width: 640px) {' + $crlf + '        .context66-header {' + $crlf + '          grid-template-columns: 1fr !important;' + $crlf + '          gap: 16px;' + $crlf + '        }' + $crlf + '        .context66-header-right {' + $crlf + '          justify-content: center !important;' + $crlf + '        }' + $crlf + '        .context66-box {' + $crlf + '          padding: 20px 16px;' + $crlf + '          min-height: 180px;' + $crlf + '        }' + $crlf + '      }' + $crlf + '    </style>'
$c = $c.Replace($old, $new)
Set-Content $f $c -NoNewline
Write-Host 'Fix 2 done'
