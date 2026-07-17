import re


ENCRYPTION_ALIASES = {
    "WPA": "WPA",
    "WPA2": "WPA",
    "WPA3": "WPA",
    "WEP": "WEP",
    "NOPASS": "nopass",
    "NONE": "nopass",
}


def normalize_encryption(encryption: str) -> str:
    normalized_encryption = ENCRYPTION_ALIASES.get(encryption.strip().upper())
    if not normalized_encryption:
        supported_values = ", ".join(ENCRYPTION_ALIASES)
        raise ValueError(
            f"Unsupported Wi-Fi encryption type. Use one of: {supported_values}."
        )
    return normalized_encryption


def generate_wifi_qr_payload(
    *,
    ssid: str,
    password: str,
    encryption: str,
) -> str:
    qr_encryption = normalize_encryption(encryption)
    escaped_ssid = _escape_wifi_value(ssid)
    escaped_password = _escape_wifi_value(password)
    return f"WIFI:T:{qr_encryption};S:{escaped_ssid};P:{escaped_password};;"


def _escape_wifi_value(value: str) -> str:
    return re.sub(r'([\\;,:\"])', r"\\\1", value)
