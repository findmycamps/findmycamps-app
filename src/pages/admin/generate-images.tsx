// pages/admin/generate-images.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Play,
  CheckCircle,
  XCircle,
  SkipForward,
  Gift,
} from "lucide-react";
import { batchGenerateImagesForAllCamps } from "../../utils/batchImageGenerator";

export default function GenerateImagesPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleBatchGeneration = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      const batchResult = await batchGenerateImagesForAllCamps();
      setResult(batchResult);
    } catch (error) {
      console.error("Batch generation failed:", error);
      setResult({ error: error.message });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          <Zap className="inline w-8 h-8 mr-2" />
          FREE AI Image Generation
        </h1>

        {/* Cost Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <Gift className="w-5 h-5 mr-2" />
              Completely FREE!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-green-800 font-semibold">
                🎉 Zero Cost Solution
              </p>
              <p className="text-green-700 text-sm mt-1">
                Using Cloudflare Workers AI - Professional quality images at no
                cost!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generate Images for All Camps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">
                What This Does:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Generates professional AI images using Cloudflare Workers AI
                </li>
                <li>• Downloads and stores images in Firebase Storage</li>
                <li>• Updates Firestore with permanent image URLs</li>
                <li>• Skips camps that already have images</li>
                <li>• Completely FREE - no cost for any number of images</li>
              </ul>
            </div>

            {result && !result.error && (
              <div className="space-y-4">
                <h3 className="font-semibold">Generation Complete!</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Badge variant="default" className="mb-2">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Success
                    </Badge>
                    <p className="text-2xl font-bold text-green-600">
                      {result.success}
                    </p>
                  </div>
                  <div className="text-center">
                    <Badge variant="destructive" className="mb-2">
                      <XCircle className="w-4 h-4 mr-1" />
                      Failed
                    </Badge>
                    <p className="text-2xl font-bold text-red-600">
                      {result.failed}
                    </p>
                  </div>
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-2">
                      <SkipForward className="w-4 h-4 mr-1" />
                      Skipped
                    </Badge>
                    <p className="text-2xl font-bold text-yellow-600">
                      {result.skipped}
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded text-center">
                  <p className="text-green-800 font-bold text-lg">
                    💰 Total Cost: $0.00 (FREE!)
                  </p>
                </div>
              </div>
            )}

            {result?.error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded">
                <p className="text-red-600 font-semibold">Error:</p>
                <p className="text-red-600">{result.error}</p>
              </div>
            )}

            <Button
              onClick={handleBatchGeneration}
              disabled={isRunning}
              className="w-full"
              size="lg"
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating FREE Images...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start FREE Generation
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
