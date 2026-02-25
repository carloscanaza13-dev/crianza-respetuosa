package com.crianza.respetuosa;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

/**
 * MainActivity - Crianza Respetuosa
 * Asistente IA en Crianza Respetuosa para padres de niños de 3-10 años
 */
public class MainActivity extends AppCompatActivity {

    private static final String APP_URL = "file:///android_asset/index.html";
    
    private WebView webView;
    private ProgressBar progressBar;
    private SwipeRefreshLayout swipeRefreshLayout;
    private FrameLayout errorLayout;
    private boolean isOnline = true;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Full screen
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );
        
        setContentView(R.layout.activity_main);

        // Initialize views
        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout);
        errorLayout = findViewById(R.id.errorLayout);

        // Configure SwipeRefreshLayout
        swipeRefreshLayout.setColorSchemeResources(
            R.color.sage_primary,
            R.color.sage_secondary
        );
        swipeRefreshLayout.setOnRefreshListener(() -> {
            if (isOnline) {
                webView.reload();
            } else {
                swipeRefreshLayout.setRefreshing(false);
                showError();
            }
        });

        // Configure WebView
        setupWebView();
        
        // Check network
        checkNetworkAndLoad();
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        
        // Enable JavaScript
        webSettings.setJavaScriptEnabled(true);
        
        // Enable DOM storage
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        
        // Enable caching
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        
        // Enable zoom controls
        webSettings.setSupportZoom(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        
        // Other settings
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);
        
        // Enable mixed content for API 21+
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP) {
            webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
            CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
        }

        // WebViewClient
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressBar.setVisibility(View.VISIBLE);
                errorLayout.setVisibility(View.GONE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
                swipeRefreshLayout.setRefreshing(false);
                
                // Inject custom CSS for mobile
                String css = "document.querySelector('meta[name=\"viewport\"]').setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');";
                view.evaluateJavascript(css, null);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request.isForMainFrame()) {
                    showError();
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                
                // Handle external links
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    // If it's our app URL, load in WebView
                    if (url.contains("crianza-respetuosa") || url.contains("localhost")) {
                        return false;
                    }
                    // Otherwise open in external browser
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, android.net.Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception e) {
                        return false;
                    }
                }
                return false;
            }
        });

        // WebChromeClient for progress
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
                if (newProgress == 100) {
                    progressBar.setVisibility(View.GONE);
                }
            }
        });
    }

    private void checkNetworkAndLoad() {
        if (isNetworkAvailable()) {
            isOnline = true;
            webView.loadUrl(APP_URL);
        } else {
            isOnline = false;
            showError();
        }
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager connectivityManager = (ConnectivityManager) 
            getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetworkInfo = connectivityManager.getActiveNetworkInfo();
        return activeNetworkInfo != null && activeNetworkInfo.isConnected();
    }

    private void showError() {
        webView.setVisibility(View.GONE);
        errorLayout.setVisibility(View.VISIBLE);
        progressBar.setVisibility(View.GONE);
        swipeRefreshLayout.setRefreshing(false);
        
        findViewById(R.id.retryButton).setOnClickListener(v -> {
            if (isNetworkAvailable()) {
                isOnline = true;
                webView.setVisibility(View.VISIBLE);
                errorLayout.setVisibility(View.GONE);
                webView.reload();
            } else {
                Toast.makeText(this, R.string.no_internet, Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            showExitDialog();
        }
    }

    private void showExitDialog() {
        new AlertDialog.Builder(this, R.style.CustomAlertDialog)
            .setTitle(R.string.exit_title)
            .setMessage(R.string.exit_message)
            .setPositiveButton(R.string.exit_yes, (dialog, which) -> finish())
            .setNegativeButton(R.string.exit_no, null)
            .show();
    }

    @Override
    protected void onResume() {
        super.onResume();
        webView.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        webView.onPause();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
