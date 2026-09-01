package com.nexzonelabs.reelive;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends BridgeActivity {

  private static final int PERMISSIONS_REQUEST_CODE = 1001;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    requestMediaPermissionsIfNeeded();
  }

  /**
   * getUserMedia() requests video AND audio. If the microphone permission is
   * denied, the whole camera request fails with a misleading "camera denied"
   * error. Request camera + microphone (and notifications) together up front.
   */
  private void requestMediaPermissionsIfNeeded() {
    List<String> needed = new ArrayList<>();

    if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
        != PackageManager.PERMISSION_GRANTED) {
      needed.add(Manifest.permission.CAMERA);
    }
    if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
        != PackageManager.PERMISSION_GRANTED) {
      needed.add(Manifest.permission.RECORD_AUDIO);
    }
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
        && ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
        != PackageManager.PERMISSION_GRANTED) {
      needed.add(Manifest.permission.POST_NOTIFICATIONS);
    }

    if (!needed.isEmpty()) {
      ActivityCompat.requestPermissions(
          this,
          needed.toArray(new String[0]),
          PERMISSIONS_REQUEST_CODE
      );
    }
  }
}
