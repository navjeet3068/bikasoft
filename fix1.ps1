$f = 'e:\Work\Bikasoft\index.html'
$c = Get-Content $f -Raw
$crlf = [char]13 + [char]10

# FIX 1: Add triple-column-container responsive
$old = '        .inner-box .btn {' + $crlf + '          align-self: center;' + $crlf + '        }' + $crlf + '      }' + $crlf + $crlf + '      /* CONTEXT66 SECTION STYLES */'
$new = '        .inner-box .btn {' + $crlf + '          align-self: center;' + $crlf + '        }' + $crlf + '      }' + $crlf + $crlf + '      @media (max-width: 768px) {' + $crlf + '        .triple-column-container {' + $crlf + '          grid-template-columns: 1fr;' + $crlf + '          gap: 16px;' + $crlf + '        }' + $crlf + '        .triple-column-item {' + $crlf + '          align-items: center;' + $crlf + '          text-align: center;' + $crlf + '        }' + $crlf + '      }' + $crlf + $crlf + '      /* CONTEXT66 SECTION STYLES */'
$c = $c.Replace($old, $new)
Set-Content $f $c -NoNewline
Write-Host 'Fix 1 done'
