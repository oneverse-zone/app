import 'package:flutter/material.dart';

class CryptoAsset extends StatefulWidget {
  const CryptoAsset({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() => _CryptoAssetState();
}

class _CryptoAssetState extends State<CryptoAsset> {
  handleScan() {}

  handleAddWallet() {}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('data'),
        actions: [
          IconButton(onPressed: handleScan, icon: const Icon(Icons.scanner)),
          IconButton(onPressed: handleAddWallet, icon: const Icon(Icons.plus_one))
        ],
      ),
      body: const Text('crypto asset'),
    );
  }
}
